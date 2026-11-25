// Sizzle Station — hand-in program for the make.fun best-cooking-game bounty.
// Node 22, standard library only. It copies the playable game and the
// screenshots beside this file into the output directory and writes the
// dossier the judge reads, using the vendored make.fun library.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(here, 'game');
const shotsDir = join(here, 'screenshots');
if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('game/index.html is missing — the game cannot be handed in');
}
const shots = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((name) => !name.startsWith('.'))
  : [];
if (shots.length < 3) {
  throw new Error('need at least 3 screenshots, found ' + shots.length);
}

mkdirSync(outDir, { recursive: true });
cpSync(gameDir, join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

// Read the dossier back and prove it is the one we just wrote: it must parse
// as JSON and its sha256 is printed so two runs can be compared byte for byte.
const written = readFileSync(join(outDir, 'dossier.json'), 'utf8');
JSON.parse(written);
const digest = createHash('sha256').update(written).digest('hex');
console.log('handed in ' + shots.length + ' screenshots, dossier ' + dossier.length + ' bytes, sha256 ' + digest);
