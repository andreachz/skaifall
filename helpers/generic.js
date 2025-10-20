function checkNodeVersion(minMajor = 22) {
  const version = process.version; // e.g. "v22.3.0"
  const [major, minor, patch] = version.replace(/^v/, '').split('.').map(Number);

  if (major >= minMajor) {
    // console.log(`✅ Node.js version ${version} is supported (>=${minMajor}).`);
    return true;
  } else {
    console.error(`❌ Node.js version ${version} is too old. Please upgrade to >=${minMajor}.`);
    return false;
  }
}

function isJson(s){
  try{
    JSON.parse(s)
    return true
  }
  catch{
    return false
  }
}

// file: detectFileType.js
/**
 * Detect probable file extension + mime from a Buffer via magic numbers.
 * Returns { ext, mime } or null if unknown.
 */
function detectFileType(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 4) return null;

  const check = (sig, offset = 0) =>
    buf.length >= offset + sig.length &&
    sig.every((b, i) => buf[offset + i] === b);

  const u32 = (o) => buf.readUInt32BE(o);

  // --- Images ---
  if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) return { ext: 'png', mime: 'image/png' };
  if (check([0xFF, 0xD8, 0xFF])) return { ext: 'jpg', mime: 'image/jpeg' };
  if (check([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || check([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])) return { ext: 'gif', mime: 'image/gif' };
  if (check([0x52, 0x49, 0x46, 0x46]) && check([0x57, 0x45, 0x42, 0x50], 8)) return { ext: 'webp', mime: 'image/webp' };
  if (check([0x49, 0x49, 0x2A, 0x00]) || check([0x4D, 0x4D, 0x00, 0x2A])) return { ext: 'tif', mime: 'image/tiff' };
  if (check([0x42, 0x4D])) return { ext: 'bmp', mime: 'image/bmp' };
  if (check([0x00, 0x00, 0x01, 0x00])) return { ext: 'ico', mime: 'image/x-icon' };
  // HEIF/HEIC/HEIF brand (ISO BMFF)
  if (check([0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = buf.subarray(8, 12).toString('ascii');
    if (/^heic|heix|hevc|hevx|mif1|msf1$/i.test(brand)) return { ext: 'heic', mime: 'image/heic' };
  }

  // --- Audio ---
  if (check([0x49, 0x44, 0x33])) return { ext: 'mp3', mime: 'audio/mpeg' }; // ID3 tag
  if (check([0xFF, 0xFB])) return { ext: 'mp3', mime: 'audio/mpeg' };        // MPEG frame
  if (check([0x52, 0x49, 0x46, 0x46]) && check([0x57, 0x41, 0x56, 0x45], 8)) return { ext: 'wav', mime: 'audio/wav' };
  if (check([0x4F, 0x67, 0x67, 0x53])) return { ext: 'ogg', mime: 'audio/ogg' };
  if (check([0x66, 0x4C, 0x61, 0x43])) return { ext: 'flac', mime: 'audio/flac' };

  // --- Video/Containers ---
  // MP4 family: size(4) + 'ftyp' + major brand
  if (buf.length >= 12 && u32(0) >= 8 && buf.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buf.toString('ascii', 8, 12);
    if (/^mp4|isom|iso2|avc1|3gp|3g2|M4V|MSNV|dash$/i.test(brand)) return { ext: 'mp4', mime: 'video/mp4' };
    if (/^m4a$/i.test(brand)) return { ext: 'm4a', mime: 'audio/mp4' };
  }
  // QuickTime
  if (buf.length >= 12 && u32(0) >= 8 && buf.toString('ascii', 4, 8) === 'ftyp' && /^qt  $/.test(buf.toString('ascii', 8, 12))) {
    return { ext: 'mov', mime: 'video/quicktime' };
  }
  // WebM/Matroska (EBML)
  if (check([0x1A, 0x45, 0xDF, 0xA3])) return { ext: 'webm', mime: 'video/webm' };

  // --- Archives / Docs ---
  if (check([0x50, 0x4B, 0x03, 0x04])) {
    // ZIP and many ZIP-based formats
    // Try to refine by looking for distinctive files (best-effort; requires more bytes)
    const s = buf.toString('latin1');
    if (s.includes('[Content_Types].xml') && s.includes('word/')) return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    if (s.includes('[Content_Types].xml') && s.includes('xl/')) return { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    if (s.includes('[Content_Types].xml') && s.includes('ppt/')) return { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
    if (s.includes('AndroidManifest.xml')) return { ext: 'apk', mime: 'application/vnd.android.package-archive' };
    return { ext: 'zip', mime: 'application/zip' };
  }
  if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00])) return { ext: 'rar', mime: 'application/vnd.rar' };        // RAR v4
  if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00])) return { ext: 'rar', mime: 'application/vnd.rar' }; // RAR v5
  if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) return { ext: '7z', mime: 'application/x-7z-compressed' };
  if (check([0x1F, 0x8B, 0x08])) return { ext: 'gz', mime: 'application/gzip' };
  if (check([0x42, 0x5A, 0x68])) return { ext: 'bz2', mime: 'application/x-bzip2' };
  if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) return { ext: 'xz', mime: 'application/x-xz' };

  // --- Documents / Data ---
  if (check([0x25, 0x50, 0x44, 0x46])) return { ext: 'pdf', mime: 'application/pdf' };
  if (check([0x00, 0x00, 0x01, 0x00])) return { ext: 'ico', mime: 'image/x-icon' };
  if (check([0x50, 0x4B, 0x03, 0x04]) || check([0x50, 0x4B, 0x05, 0x06]) || check([0x50, 0x4B, 0x07, 0x08])) return { ext: 'zip', mime: 'application/zip' };
  if (check([0x53, 0x51, 0x4C, 0x69, 0x74, 0x65, 0x20, 0x66])) return { ext: 'sqlite', mime: 'application/vnd.sqlite3' };

  // --- Executables ---
  if (check([0x4D, 0x5A])) return { ext: 'exe', mime: 'application/vnd.microsoft.portable-executable' }; // MZ (PE)
  if (check([0x7F, 0x45, 0x4C, 0x46])) return { ext: 'elf', mime: 'application/x-elf' };

  return null;
}




module.exports = {checkNodeVersion, isJson, detectFileType}