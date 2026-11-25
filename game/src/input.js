// Sizzle Station — mouse and keyboard input: clicks on bins, grill, plate
// and the serve button, plus the matching keys.
import { INGREDIENTS } from './config.js';
import { addIngredient, takeFromGrill, undoPlate, servePlate, startShift } from './state.js';

function inside(point, rect) {
  return rect && point.x >= rect.x && point.x <= rect.x + rect.w &&
    point.y >= rect.y && point.y <= rect.y + rect.h;
}

export function attachInput(canvas, state) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
    if (state.phase === 'title') { startShift(state); return; }
    if (state.phase === 'over') { startShift(state); return; }
    for (const bin of state.ui.bins || []) {
      if (inside(point, bin)) { addIngredient(state, bin.id); return; }
    }
    if (inside(point, state.ui.grill)) { takeFromGrill(state); return; }
    if (inside(point, state.ui.plate)) { undoPlate(state); return; }
    if (inside(point, state.ui.serve)) { servePlate(state); return; }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && state.phase !== 'playing') { startShift(state); return; }
    if (state.phase !== 'playing') return;
    if (event.key === ' ') { event.preventDefault(); servePlate(state); return; }
    if (event.key === 'g' || event.key === 'G') { takeFromGrill(state); return; }
    if (event.key === 'Backspace') { undoPlate(state); return; }
    if (event.key === 'r' || event.key === 'R') { startShift(state); return; }
    const ingredient = INGREDIENTS.find((item) => item.key === event.key);
    if (ingredient) addIngredient(state, ingredient.id);
  });
}
