// Placeholder API for sending captured frame to backend ALPR
// Replace BASE_URL and route when backend is ready.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function submitFrameForALPR(dataUrl) {
  // dataUrl is a PNG/JPEG data URL string from canvas
  // We convert to a small payload; backend should accept base64 image.
  const payload = { imageDataUrl: dataUrl };
  const res = await fetch(`${BASE_URL}/alpr/recognize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`ALPR request failed: ${res.status}`);
  }
  const json = await res.json();
  // Expect shape: { plate: 'GGE123ZY', confidence: 0.92, bbox: {x,y,w,h}, rawText: '...' }
  return json;
}
