use cardano/output.{OutputReference}
use cardano/transaction.{Transaction}

// Passenger registry (wallet linking / registration)

pub type PassengerDatum {
  wallet_pk: pubkey,
  registered_at: int,
}

pub type PassengerRedeemer {
  Register(pubkey)
  Unregister
}

validator passenger_registry {
  spend(
    datum: Option<PassengerDatum>,
    redeemer: PassengerRedeemer,
    _own_ref: OutputReference,
    self: Transaction,
  ) {
    when redeemer is {
      Register(wallet) -> {
        require
        tx_signed_by(wallet)
        "passenger signature required"
      }

      // off-chain: create datum with registered_at
      Unregister -> {
        expect Some(PassengerDatum { wallet_pk }) = datum
        require
        tx_signed_by(wallet_pk)
        "current passenger must sign"
      }
    }
  }

  else(_) {
    fail
  }
}
