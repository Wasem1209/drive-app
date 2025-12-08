use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction, placeholder}

// Driver registry validator (vehicle identity & compliance)

// Admin pubkey hash (28 bytes) - replace with your actual admin key hash
const admin_pkh: VerificationKeyHash =
  #"14ed029a5d871f49cd81c378181a40820f135c487571e6fa"

pub type VehicleDatum {
  owner_pkh: VerificationKeyHash,
  token_name: ByteArray,
  roadworthy: Bool,
  insurance_expiry: Int,
  tax_expiry: Int,
}

pub type VehicleRedeemer {
  Update
  Transfer { new_owner: VerificationKeyHash }
  FlagUnsafe
}

fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

validator driver_registry {
  spend(
    datum: Option<VehicleDatum>,
    redeemer: VehicleRedeemer,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      Update -> {
        expect Some(d) = datum
        signed_by(tx, d.owner_pkh)
      }
      Transfer { new_owner: _ } -> {
        expect Some(d) = datum
        signed_by(tx, d.owner_pkh)
      }
      FlagUnsafe -> signed_by(tx, admin_pkh)
    }
  }

  else(_) {
    fail
  }
}

// ─────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────

const test_owner: VerificationKeyHash =
  #"abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234"

const test_other: VerificationKeyHash =
  #"dcba4321dcba4321dcba4321dcba4321dcba4321dcba4321dcba4321"

fn test_datum() -> VehicleDatum {
  VehicleDatum {
    owner_pkh: test_owner,
    token_name: "TEST-VEHICLE",
    roadworthy: True,
    insurance_expiry: 1735689600000,
    tax_expiry: 1735689600000,
  }
}

fn test_tx(signers: List<VerificationKeyHash>) -> Transaction {
  Transaction { ..placeholder, extra_signatories: signers }
}

fn test_ref() -> OutputReference {
  OutputReference {
    transaction_id: #"0000000000000000000000000000000000000000000000000000000000000000",
    output_index: 0,
  }
}

// Test: Update requires owner signature
test update_with_owner_succeeds() {
  let datum = Some(test_datum())
  let tx = test_tx([test_owner])
  driver_registry.spend(datum, Update, test_ref(), tx)
}

// Test: Update fails without owner
test update_without_owner_fails() fail {
  let datum = Some(test_datum())
  let tx = test_tx([test_other])
  driver_registry.spend(datum, Update, test_ref(), tx)
}

// Test: Transfer requires owner signature
test transfer_with_owner_succeeds() {
  let datum = Some(test_datum())
  let tx = test_tx([test_owner])
  driver_registry.spend(datum, Transfer { new_owner: test_other }, test_ref(), tx)
}

// Test: FlagUnsafe requires admin signature
test flag_unsafe_with_admin_succeeds() {
  let datum = Some(test_datum())
  let tx = test_tx([admin_pkh])
  driver_registry.spend(datum, FlagUnsafe, test_ref(), tx)
}

// Test: FlagUnsafe fails without admin
test flag_unsafe_without_admin_fails() fail {
  let datum = Some(test_datum())
  let tx = test_tx([test_owner])
  driver_registry.spend(datum, FlagUnsafe, test_ref(), tx)
}
