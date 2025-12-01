use cardano/output.{OutputReference}
use cardano/transaction.{Transaction}

// Violation manager (issue, pay, revoke). Evidence stored off-chain (IPFS CID in datum).

pub type ViolationDatum {
  fine_id: text,
  vehicle_policy: text,
  vehicle_token: text,
  amount: int,
  evidence_cid: text,
  officer_pk: pubkey,
  issued_at: int,
  status: text,
}

pub type ViolationRedeemer {
  Issue(pubkey)
  Pay(pubkey)
  Revoke
}

validator violation_manager {
  spend(
    datum: Option<ViolationDatum>,
    redeemer: ViolationRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    when redeemer is {
      Issue(officer) -> {
        require
        tx_signed_by(officer)
        "officer signature required"
      }

      // off-chain: create UTXO with status = "UNPAID"
      Pay(driver) -> {
        require
        tx_signed_by(driver)
        "driver signature required"
      }

      // off-chain: ensure funds flow to gov and mark status = "PAID"
      Revoke -> {
        require
        tx_signed_by(
          #"14ed029a5d871f49cd81c378181a40820f135c487571e6fab6c8da084a5f845d58259585010b9fe238146184f2910d330f6d5004336954b5f19bbd0699659bd6",
        )
        "admin signature required"
      }
    }
  }

  else(_) {
    fail
  }
}
