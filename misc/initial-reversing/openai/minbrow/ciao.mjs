// run.mjs
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function importRemote(url, filename) {
  const code = await (await fetch(url)).text();
  const file = join(tmpdir(), filename);
  await fs.writeFile(file, code, 'utf8');
  return `file://${file}`;
}

// Also fetch the *dependencies* and place them next to the entry file,
// or rewrite the import specifiers accordingly.
// const entry = await importRemote(
//   'https://cdn.oaistatic.com/assets/i2i0n43zeu7c4jdz.js',
//   'i2i0n43zeu7c4jdz.js'
// );

const entry = await importRemote(
  'https://cdn.oaistatic.com/assets/manifest-88200d41.js',
  'manifest-88200d41.js'
);
// ...do the same for i3wdlecy1t2dcwiy.js and h7tehyd6zylti1q7.js, saved with the same names in the same dir

const mod = await import(entry);
