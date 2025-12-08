import * as Cardano from '@emurgo/cardano-serialization-lib-browser';

export function hexToBech32(hex) {
  if (!hex) return '';
  // already bech32?
  if (typeof hex === 'string' && (hex.startsWith('addr') || hex.startsWith('stake'))) return hex;
  const h = (hex || '').startsWith('0x') ? hex.slice(2) : hex;
  // convert hex string to Uint8Array
  const bytes = new Uint8Array(h.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const addr = Cardano.Address.from_bytes(bytes);
  return addr.to_bech32();
}

function hexToBytes(hex) {
  if (!hex) return new Uint8Array();
  let h = typeof hex === 'string' ? hex : '';
  if (h.startsWith('0x')) h = h.slice(2);
  if (h.length % 2) h = '0' + h;
  const bytes = new Uint8Array(h.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  return bytes;
}

export function parseBalance(raw) {
  // Return lovelace amount as decimal string when possible
  try {
    if (raw == null) return '0';
    // Already a decimal string
    if (typeof raw === 'string' && /^\d+$/.test(raw)) return raw;

    // If it's a hex string (CBOR) like '821a00...'
    if (typeof raw === 'string' && /^[0-9a-fA-F]+$/.test(raw.replace(/^0x/, ''))) {
      const bytes = hexToBytes(raw);
      try {
        const value = Cardano.Value.from_bytes(bytes);
        const coin = value.coin();
        return coin.to_str();
      } catch (e) {
        // Not a Value CBOR, fallthrough
      }
    }

    // If it's a Buffer/Uint8Array
    if (raw instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(raw))) {
      const bytes = raw instanceof Uint8Array ? raw : Uint8Array.from(raw);
      try {
        const value = Cardano.Value.from_bytes(bytes);
        const coin = value.coin();
        return coin.to_str();
      } catch (e) {
        // fallthrough
      }
    }

    // If it's an object with to_str() or toString
    if (typeof raw === 'object' && raw !== null) {
      if (typeof raw.to_str === 'function') return raw.to_str();
      if (typeof raw.toString === 'function') return raw.toString();
    }

    // Fallback: string conversion
    return String(raw || '0');
  } catch (e) {
    return String(raw || '0');
  }
}

export default { hexToBech32 };
