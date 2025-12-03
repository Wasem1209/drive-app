// src/services/servicedriver.ts
import { Lucid, Blockfrost, WalletApi } from "lucid-cardano";

export class ServiceDriver {
    static getCompliance(wallet: string) {
        throw new Error("Method not implemented.");
    }
    static createInsuranceTx(wallet: any) {
        throw new Error("Method not implemented.");
    }
    private lucid!: Lucid;

    /**
     * Initialize Lucid with Nami wallet and Blockfrost
     */
    async init(wallet: WalletApi) {
        this.lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preprod.blockfrost.io/api/v0",
                process.env.BLOCKFROST_KEY!
            ),
            "Preprod"
        );

        // Attach the wallet
        this.lucid.selectWallet(wallet);
    }

    /**
     * Get the connected wallet address
     */
    async getAddress(): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");
        return this.lucid.wallet.address();
    }

    /**
     * Pay for insurance (example on-chain transaction)
     */
    async payInsurance(amountLovelace: bigint): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");

        const tx = await this.lucid
            .newTx()
            .payToAddress(await this.getAddress(), { lovelace: amountLovelace })
            .complete();

        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    /**
     * Pay road tax (example)
     */
    async payRoadTax(amountLovelace: bigint): Promise<string> {
        if (!this.lucid) throw new Error("Lucid not initialized");

        const tx = await this.lucid
            .newTx()
            .payToAddress(await this.getAddress(), { lovelace: amountLovelace })
            .complete();

        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    /**
     * Check driver on-chain status
     */
    async getDriverStatus(): Promise<{ insurancePaid: boolean; roadTaxPaid: boolean }> {
        // Placeholder: You can query UTXOs or on-chain metadata
        // For MVP, returning dummy data
        return {
            insurancePaid: true,
            roadTaxPaid: false,
        };
    }
}
