use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

// Admin governance (update params, approve/revoke officers). Single-admin MVP.

// Admin pubkey hash (28 bytes)
const admin_pkh: VerificationKeyHash =
  #"14ed029a5d871f49cd81c378181a40820f135c487571e6fa"

pub type AdminDatum {
  key: ByteArray,
  value: ByteArray,
  updated_at: Int,
}

pub type AdminRedeemer {
  Update { key: ByteArray, value: ByteArray }
  ApproveOfficer { officer: VerificationKeyHash }
  RevokeOfficer { officer: VerificationKeyHash }
}

fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

validator admin_governance {
  spend(
    _datum: Option<AdminDatum>,
    _redeemer: AdminRedeemer,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    // All governance actions require admin signature
    signed_by(tx, admin_pkh)
  }

  else(_) {
    fail
  }
}
