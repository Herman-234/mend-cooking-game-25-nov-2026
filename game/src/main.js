// Sizzle Station — entry point: builds the game, wires input, and runs the
// render loop. A ?shot= parameter freezes a staged moment for screenshots.
import { createGame, updateGame } from './state.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = createGame();

const shot = new URLSearchParams(window.location.search).get('shot');
if (shot) applyShot(state, shot);
attachInput(canvas, state);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!state.frozen) updateGame(state, dt);
  drawGame(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
