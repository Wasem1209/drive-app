use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}

// Rewards mint policy (admin-only). Backend computes eligibility; admin signs mint tx.

validator rewards_policy {
  mint(redeemer: Data, policy_id: PolicyId, self: Transaction) {
    require
    tx_signed_by(
      #"14ed029a5d871f49cd81c378181a40820f135c487571e6fab6c8da084a5f845d58259585010b9fe238146184f2910d330f6d5004336954b5f19bbd0699659bd6",
    )
    "admin signature required for mint"
  }

  else(_) {
    fail
  }
}
