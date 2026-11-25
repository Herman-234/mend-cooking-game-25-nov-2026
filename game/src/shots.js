// Sizzle Station — deterministic screenshot states. Opening the game with
// ?shot=start|play|serve|end freezes a staged moment so the screenshots are
// real renders of this game's own code, taken in a browser.
import { RECIPES, ORDER_PATIENCE } from './config.js';
import { makeOrder } from './state.js';

function stagedOrder(name, patience) {
  const recipe = RECIPES.find((r) => r.name === name);
  return makeOrder(recipe, patience);
}

export function applyShot(state, shot) {
  state.frozen = true;
  if (shot === 'start') {
    state.phase = 'title';
    state.orders = [stagedOrder('Classic Burger', 32), stagedOrder('Cheese Melt', 25)];
    state.message = 'Welcome to Sizzle Station!';
    return;
  }
  if (shot === 'play') {
    state.phase = 'playing';
    state.timeLeft = 87;
    state.score = 240;
    state.coins = 32;
    state.served = 3;
    state.combo = 1;
    state.orders = [
      stagedOrder('Classic Burger', 28),
      stagedOrder('Cheese Melt', 14),
      stagedOrder('Garden Stack', 36),
    ];
    state.plate = ['bun', 'patty', 'cheese'];
    state.grill = { item: 'patty', progress: 3.2 };
    state.message = 'Cheese on! Patty almost ready…';
    return;
  }
  if (shot === 'serve') {
    state.phase = 'playing';
    state.timeLeft = 65;
    state.score = 480;
    state.coins = 58;
    state.served = 5;
    state.combo = 2;
    state.orders = [
      stagedOrder('Cheese Melt', 25),
      stagedOrder('Double Trouble', 33),
    ];
    state.plate = ['bun', 'patty', 'cheese'];
    state.grill = { item: null, progress: 0 };
    state.message = 'Plate complete — SERVE it!';
    return;
  }
  if (shot === 'end') {
    state.phase = 'over';
    state.timeLeft = 0;
    state.score = 1240;
    state.coins = 96;
    state.served = 9;
    state.results = { score: 1240, coins: 96, served: 9, reason: "Time's up — shift over!" };
    state.orders = [stagedOrder('Veggie Delight', 20)];
    state.message = "Time's up — shift over!";
    return;
  }
  state.frozen = false;
}
