// Mocked reviews API

export async function submitDriverReview({ driverId, rating, text }) {
  await delay(700);
  if (!driverId) throw new Error('Missing driver ID');
  return {
    ok: true,
    reviewId: `rev-${Math.random().toString(36).slice(2,8)}`,
    driverId,
    rating,
    text: (text || '').slice(0, 500),
    timestamp: Date.now(),
  };
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
