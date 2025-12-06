use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

// Violation manager (issue, pay, revoke). Evidence stored off-chain (IPFS CID in datum).

// Admin pubkey hash (28 bytes)
const admin_pkh: VerificationKeyHash =
  #"14ed029a5d871f49cd81c378181a40820f135c487571e6fa"

pub type ViolationDatum {
  fine_id: ByteArray,
  vehicle_policy: ByteArray,
  vehicle_token: ByteArray,
  amount: Int,
  evidence_cid: ByteArray,
  officer_pkh: VerificationKeyHash,
  issued_at: Int,
  status: ByteArray,
}

pub type ViolationRedeemer {
  Issue { officer: VerificationKeyHash }
  Pay { driver: VerificationKeyHash }
  Revoke
}

fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

validator violation_manager {
  spend(
    _datum: Option<ViolationDatum>,
    redeemer: ViolationRedeemer,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      Issue { officer } -> signed_by(tx, officer)
      Pay { driver } -> signed_by(tx, driver)
      Revoke -> signed_by(tx, admin_pkh)
    }
  }

  else(_) {
    fail
  }
}
