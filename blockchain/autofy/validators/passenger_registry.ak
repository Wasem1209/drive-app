use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

// Passenger registry (wallet linking / registration)

pub type PassengerDatum {
  wallet_pkh: VerificationKeyHash,
  registered_at: Int,
}

pub type PassengerRedeemer {
  Register { wallet: VerificationKeyHash }
  Unregister
}

fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

validator passenger_registry {
  spend(
    datum: Option<PassengerDatum>,
    redeemer: PassengerRedeemer,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      Register { wallet } -> signed_by(tx, wallet)
      Unregister -> {
        expect Some(d) = datum
        signed_by(tx, d.wallet_pkh)
      }
    }
  }

  else(_) {
    fail
  }
}
