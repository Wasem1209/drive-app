use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}

// Rewards mint policy (admin-only). Backend computes eligibility; admin signs mint tx.

// Admin pubkey hash (28 bytes)
const admin_pkh: VerificationKeyHash =
  #"14ed029a5d871f49cd81c378181a40820f135c487571e6fa"

fn signed_by(tx: Transaction, pkh: VerificationKeyHash) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

validator rewards_policy {
  mint(_redeemer: Data, _policy_id: PolicyId, tx: Transaction) {
    signed_by(tx, admin_pkh)
  }

  else(_) {
    fail
  }
}
