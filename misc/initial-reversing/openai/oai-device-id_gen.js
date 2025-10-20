// uuid-v4.js — standalone, browser + Node compatible

// Precompute 00..ff lookup for faster hex conversion
const HEX = Array.from({ length: 256 }, (_, i) => (i + 0x100).toString(16).slice(1));

// Cached getRandomValues
let _getRandomValues;

// Returns a crypto with getRandomValues (browser or Node >=15 via webcrypto)
function getCrypto() {
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.getRandomValues) {
    return globalThis.crypto;
  }
  // Node fallback (CommonJS or ESM with createRequire): require('crypto').webcrypto
  try {
    // eslint-disable-next-line no-new-func
    const req = typeof require === "function" ? require : Function("return require")();
    const { webcrypto } = req("crypto");
    if (webcrypto && webcrypto.getRandomValues) return webcrypto;
  } catch {}
  return undefined;
}

// Fill and return a 16-byte Uint8Array using CSPRNG
function getRandomBytes() {
  if (!_getRandomValues) {
    const c = getCrypto();
    if (!c || !c.getRandomValues) {
      throw new Error(
        "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
      );
    }
    _getRandomValues = c.getRandomValues.bind(c);
  }
  const bytes = new Uint8Array(16);
  _getRandomValues(bytes);
  return bytes;
}

// Format 16 bytes into xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
function formatAsUUID(bytes, offset = 0) {
  const b = bytes;
  return (
    HEX[b[offset + 0]] + HEX[b[offset + 1]] + HEX[b[offset + 2]] + HEX[b[offset + 3]] + "-" +
    HEX[b[offset + 4]] + HEX[b[offset + 5]] + "-" +
    HEX[b[offset + 6]] + HEX[b[offset + 7]] + "-" +
    HEX[b[offset + 8]] + HEX[b[offset + 9]] + "-" +
    HEX[b[offset + 10]] + HEX[b[offset + 11]] + HEX[b[offset + 12]] + HEX[b[offset + 13]] + HEX[b[offset + 14]] + HEX[b[offset + 15]]
  ).toLowerCase();
}

/**
 * Generate a UUID v4.
 * @param {Object} [options]
 * @param {Uint8Array|number[]} [options.random] - 16 random bytes to use.
 * @param {() => Uint8Array|number[]} [options.rng] - Function returning 16 random bytes.
 * @returns {string} RFC 4122 UUID v4 string.
 */
export function uuidv4(options) {
  // Fast path: use native randomUUID if available and no custom randomness requested
  const c = getCrypto();
  if (c && typeof c.randomUUID === "function" && !options) {
    return c.randomUUID();
  }

  // Get 16 random bytes from options.random, options.rng(), or CSPRNG
  const bytes =
    (options && options.random) ??
    (options && typeof options.rng === "function" && options.rng()) ??
    getRandomBytes();

  if (!bytes || bytes.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }

  // Ensure version (4) and variant (RFC 4122) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4: 0100xxxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant: 10xxxxxx

  return formatAsUUID(bytes);
}

// CommonJS default export compatibility (optional)
export default uuidv4;


// import { uuidv4 } from "./uuid-v4.js";

console.log(uuidv4()); // e.g. "c6f1db6d-6fd1-4c6d-82d4-0b3f0a1c2b2e"

// With custom randomness (must be 16 bytes):
const fixed = new Uint8Array(16); // all zeros, will still be versioned/variant-adjusted
console.log(uuidv4({ random: fixed }));
