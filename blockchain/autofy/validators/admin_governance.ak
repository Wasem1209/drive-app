use cardano/output.{OutputReference}
use cardano/transaction.{Transaction}

// Admin governance (update params, approve/revoke officers). Single-admin MVP.

pub type AdminDatum {
  key: text,
  value: text,
  updated_at: int,
}

pub type AdminRedeemer {
  Update(text, text)
  ApproveOfficer(pubkey)
  RevokeOfficer(pubkey)
}

validator admin_governance {
  spend(
    datum: Option<AdminDatum>,
    redeemer: AdminRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    require
    tx_signed_by(
      #"14ed029a5d871f49cd81c378181a40820f135c487571e6fab6c8da084a5f845d58259585010b9fe238146184f2910d330f6d5004336954b5f19bbd0699659bd6",
    )
    "admin signature required"
    // off-chain: process redeemer and update on-chain datum as needed
  }

  else(_) {
    fail
  }
}
