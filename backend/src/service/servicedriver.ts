// src/services/servicedriver.ts
import { Lucid, Blockfrost, WalletApi, Data, Constr, UTxO, SpendingValidator } from "lucid-cardano";
import { getDriverRegistryValidator, getDriverRegistryHash, ValidatorScript } from "../utils/validators";

// Vehicle datum schema matching Aiken VehicleDatum type
interface VehicleDatum {
    owner_pkh: string;
    token_name: string;
    roadworthy: boolean;
    insurance_expiry: bigint;
    tax_expiry: bigint;
}

// Parse datum from CBOR hex
function parseDatum(datumCbor: string): VehicleDatum | null {
    try {
        const decoded = Data.from(datumCbor);
        if (decoded instanceof Constr && decoded.index === 0 && decoded.fields.length === 5) {
            return {
                owner_pkh: decoded.fields[0] as string,
                token_name: decoded.fields[1] as string,
                roadworthy: decoded.fields[2] instanceof Constr && decoded.fields[2].index === 1,
                insurance_expiry: BigInt(decoded.fields[3] as any),
                tax_expiry: BigInt(decoded.fields[4] as any),
            };
        }
        return null;
    } catch {
        return null;
    }
}

// Serialize datum to CBOR
function serializeDatum(datum: VehicleDatum): string {
    return Data.to(new Constr(0, [
        datum.owner_pkh,
        datum.token_name,
        datum.roadworthy ? new Constr(1, []) : new Constr(0, []),
        datum.insurance_expiry,
        datum.tax_expiry,
    ]));
}

// Vehicle redeemer constructors matching Aiken VehicleRedeemer type
const UpdateRedeemer = (): string => Data.to(new Constr(0, []));
const TransferRedeemer = (newOwnerPkh: string): string => Data.to(new Constr(1, [newOwnerPkh]));
const FlagUnsafeRedeemer = (): string => Data.to(new Constr(2, []));

export interface ComplianceData {
    found: boolean;
    ownerPkh?: string;
    tokenName?: string;
    roadworthy?: boolean;
    insuranceExpiry?: number;
    insuranceValid?: boolean;
    taxExpiry?: number;
    taxValid?: boolean;
    utxoRef?: string;
}

export interface DriverStatus {
    insurancePaid: boolean;
    roadTaxPaid: boolean;
    roadworthy: boolean;
}

export class ServiceDriver {
    private lucid!: Lucid;
    private validatorAddress!: string;

    /**
     * Initialize Lucid with Blockfrost
     */
    async init(wallet?: WalletApi) {
        this.lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preview.blockfrost.io/api/v0",
                process.env.BLOCKFROST_KEY!
            ),
            "Preview"
        );

        // Calculate validator address
        const validator = getDriverRegistryValidator() as SpendingValidator;
        this.validatorAddress = this.lucid.utils.validatorToAddress(validator);

        // Attach wallet if provided (for client-side use)
        if (wallet) {
            this.lucid.selectWallet(wallet);
        }
    }

    /**
     * Get the connected wallet address
     */
    async getAddress(): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");
        return this.lucid.wallet.address();
    }

    /**
     * Get wallet payment key hash (28-byte pubkey hash)
     */
    async getPaymentKeyHash(): Promise<string> {
        const address = await this.getAddress();
        const details = this.lucid.utils.getAddressDetails(address);
        if (!details.paymentCredential) throw new Error("No payment credential found");
        return details.paymentCredential.hash;
    }

    /**
     * Get compliance data for a specific wallet/vehicle from on-chain UTxOs
     */
    static async getCompliance(walletPkh: string): Promise<ComplianceData> {
        // Initialize a fresh Lucid instance for querying (no wallet needed)
        const lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preview.blockfrost.io/api/v0",
                process.env.BLOCKFROST_KEY!
            ),
            "Preview"
        );

        const validator = getDriverRegistryValidator() as SpendingValidator;
        const validatorAddress = lucid.utils.validatorToAddress(validator);

        // Query all UTxOs at the validator address
        const utxos = await lucid.utxosAt(validatorAddress);

        // Find UTxO matching the owner's pubkey hash
        for (const utxo of utxos) {
            if (!utxo.datum) continue;

            const datum = parseDatum(utxo.datum);
            if (!datum) continue;

            if (datum.owner_pkh === walletPkh) {
                const now = Date.now();
                return {
                    found: true,
                    ownerPkh: datum.owner_pkh,
                    tokenName: Buffer.from(datum.token_name, 'hex').toString('utf8'),
                    roadworthy: datum.roadworthy,
                    insuranceExpiry: Number(datum.insurance_expiry),
                    insuranceValid: Number(datum.insurance_expiry) > now,
                    taxExpiry: Number(datum.tax_expiry),
                    taxValid: Number(datum.tax_expiry) > now,
                    utxoRef: `${utxo.txHash}#${utxo.outputIndex}`,
                };
            }
        }

        return { found: false };
    }

    /**
     * Create an unsigned transaction to update insurance (extend insurance_expiry)
     * Returns the unsigned tx hex for client-side signing
     */
    static async createInsuranceTx(
        walletPkh: string,
        newInsuranceExpiry: number
    ): Promise<{ unsignedTx: string } | null> {
        const lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preview.blockfrost.io/api/v0",
                process.env.BLOCKFROST_KEY!
            ),
            "Preview"
        );

        const validator = getDriverRegistryValidator() as SpendingValidator;
        const validatorAddress = lucid.utils.validatorToAddress(validator);

        // Find the user's vehicle UTxO
        const utxos = await lucid.utxosAt(validatorAddress);
        let vehicleUtxo: UTxO | null = null;
        let currentDatum: VehicleDatum | null = null;

        for (const utxo of utxos) {
            if (!utxo.datum) continue;
            const datum = parseDatum(utxo.datum);
            if (datum && datum.owner_pkh === walletPkh) {
                vehicleUtxo = utxo;
                currentDatum = datum;
                break;
            }
        }

        if (!vehicleUtxo || !currentDatum) {
            return null;
        }

        // Create updated datum with new insurance expiry
        const newDatum: VehicleDatum = {
            ...currentDatum,
            insurance_expiry: BigInt(newInsuranceExpiry),
        };

        // Build the transaction
        const tx = await lucid
            .newTx()
            .collectFrom([vehicleUtxo], UpdateRedeemer())
            .payToContract(
                validatorAddress,
                { inline: serializeDatum(newDatum) },
                vehicleUtxo.assets
            )
            .attachSpendingValidator(validator)
            .addSignerKey(walletPkh)
            .complete();

        return {
            unsignedTx: tx.toString(),
        };
    }

    /**
     * Create an unsigned transaction to update road tax (extend tax_expiry)
     */
    static async createRoadTaxTx(
        walletPkh: string,
        newTaxExpiry: number
    ): Promise<{ unsignedTx: string } | null> {
        const lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preview.blockfrost.io/api/v0",
                process.env.BLOCKFROST_KEY!
            ),
            "Preview"
        );

        const validator = getDriverRegistryValidator() as SpendingValidator;
        const validatorAddress = lucid.utils.validatorToAddress(validator);

        const utxos = await lucid.utxosAt(validatorAddress);
        let vehicleUtxo: UTxO | null = null;
        let currentDatum: VehicleDatum | null = null;

        for (const utxo of utxos) {
            if (!utxo.datum) continue;
            const datum = parseDatum(utxo.datum);
            if (datum && datum.owner_pkh === walletPkh) {
                vehicleUtxo = utxo;
                currentDatum = datum;
                break;
            }
        }

        if (!vehicleUtxo || !currentDatum) {
            return null;
        }

        const newDatum: VehicleDatum = {
            ...currentDatum,
            tax_expiry: BigInt(newTaxExpiry),
        };

        const tx = await lucid
            .newTx()
            .collectFrom([vehicleUtxo], UpdateRedeemer())
            .payToContract(
                validatorAddress,
                { inline: serializeDatum(newDatum) },
                vehicleUtxo.assets
            )
            .attachSpendingValidator(validator)
            .addSignerKey(walletPkh)
            .complete();

        return {
            unsignedTx: tx.toString(),
        };
    }

    /**
     * Check driver on-chain status using their payment key hash
     */
    async getDriverStatus(): Promise<DriverStatus> {
        if (!this.lucid) throw new Error("Lucid not initialized");

        const pkh = await this.getPaymentKeyHash();
        const compliance = await ServiceDriver.getCompliance(pkh);

        if (!compliance.found) {
            return {
                insurancePaid: false,
                roadTaxPaid: false,
                roadworthy: false,
            };
        }

        return {
            insurancePaid: compliance.insuranceValid || false,
            roadTaxPaid: compliance.taxValid || false,
            roadworthy: compliance.roadworthy || false,
        };
    }

    /**
     * Instance method: Pay for insurance by signing and submitting tx
     */
    async payInsurance(newExpiryMs: number): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");

        const pkh = await this.getPaymentKeyHash();
        const result = await ServiceDriver.createInsuranceTx(pkh, newExpiryMs);

        if (!result) throw new Error("Vehicle not found on-chain");

        // Parse the tx back for signing
        const tx = this.lucid.fromTx(result.unsignedTx);
        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    /**
     * Instance method: Pay road tax by signing and submitting tx
     */
    async payRoadTax(newExpiryMs: number): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");

        const pkh = await this.getPaymentKeyHash();
        const result = await ServiceDriver.createRoadTaxTx(pkh, newExpiryMs);

        if (!result) throw new Error("Vehicle not found on-chain");

        const tx = this.lucid.fromTx(result.unsignedTx);
        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    /**
     * Get the validator address for reference
     */
    getValidatorAddress(): string {
        if (!this.validatorAddress) throw new Error("Not initialized");
        return this.validatorAddress;
    }
}
