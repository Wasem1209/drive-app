use cardano/output.{OutputReference}
use cardano/transaction.{Transaction}

// Driver registry validator (vehicle identity & compliance)

// NOTE: admin pubkey inlined as hex literal (public key only)
pub type VehicleDatum {
  owner_pk: pubkey,
  token_name: text,
  roadworthy: bool,
  insurance_expiry: int,
  tax_expiry: int,
}

pub type VehicleRedeemer {
  Update(pubkey)
  Transfer(pubkey)
  FlagUnsafe
}

validator driver_registry {
  spend(
    datum: Option<VehicleDatum>,
    redeemer: VehicleRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    when redeemer is {
      Update(owner) -> {
        expect Some(VehicleDatum { owner_pk }) = datum
        require
        tx_signed_by(owner)
        "owner signature required"
        require
        owner_pk == owner
        "owner mismatch"
      }

      Transfer(new_owner) -> {
        expect Some(VehicleDatum { owner_pk }) = datum
        require
        tx_signed_by(owner_pk)
        "owner signature required"
      }

      // off-chain: create new UTXO setting owner_pk = new_owner
      FlagUnsafe -> {
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
