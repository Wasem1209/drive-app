use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

// Admin pubkey hash (28 bytes)
const admin_pkh: VerificationKeyHash =
  #"14ed029a5d871f49cd81c378181a40820f135c487571e6fa"

// --- Datum representing a violation/fine ---
pub type ViolationDatum {
  fine_id: ByteArray,
  vehicle_policy: ByteArray,
  vehicle_token: ByteArray,
  amount: Int,
  evidence_cid: ByteArray,
  officer_pkh: VerificationKeyHash,
  issued_at: Int,
  status: ByteArray, // "issued", "paid", "revoked"
}

// --- Actions that can be performed ---
pub type ViolationRedeemer {
  Issue { officer: VerificationKeyHash }
  Pay { driver: VerificationKeyHash }
  Revoke
}

// --- Helper: check if transaction is signed by a PKH ---
fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

// --- Validator ---
validator violation_manager {
  spend(
    datum: Option<ViolationDatum>,
    redeemer: ViolationRedeemer,
    own_ref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      // Officer issuing the fine
      Issue { officer } ->
        signed_by(tx, officer)

      // Driver paying the fine
      Pay { driver } ->
        signed_by(tx, driver) &&
        case datum {
          Some(d) ->
            d.status == #"issued" &&
            let outputs_to_officer =
              list.filter(tx.outputs, fn(o) -> o.address == d.officer_pkh end)
            let total_paid =
              list.fold(outputs_to_officer, 0, fn(o, acc) -> acc + o.value end)
            total_paid == d.amount
          None -> false
        }

      // Admin revoking the fine
      Revoke ->
        signed_by(tx, admin_pkh)
    }
  }

  // Automatically update the datum status
  spend_result(
    datum: Option<ViolationDatum>,
    redeemer: ViolationRedeemer,
    _own_ref: OutputReference,
    _tx: Transaction,
  ) -> Option<ViolationDatum> {
    case (datum, redeemer) {
      (Some(d), Pay { _ }) -> Some({ d with status: #"paid" })
      (Some(d), Revoke) -> Some({ d with status: #"revoked" })
      _ -> datum
    }
  }

  else(_) {
    fail
  }
}
