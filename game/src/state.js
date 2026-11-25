// Sizzle Station — game state and the rules: orders, the grill, the plate,
// serving, the timer and the shift's end.
import { RECIPES, GAME_LENGTH, ORDER_PATIENCE, GRILL_TIME, MAX_HEARTS, MAX_ORDERS } from './config.js';

export function createGame() {
  return {
    phase: 'title', // title | playing | over
    timeLeft: GAME_LENGTH,
    score: 0,
    coins: 0,
    served: 0,
    combo: 0,
    comboTimer: 0,
    hearts: MAX_HEARTS,
    orders: [],
    plate: [],
    grill: { item: null, progress: 0 },
    message: 'Welcome to Sizzle Station!',
    messageTimer: 0,
    spawnTimer: 2,
    frozen: false, // true for deterministic screenshot states (?shot=...)
    results: null,
    ui: {},
  };
}

let orderSeq = 0;

export function makeOrder(recipe, patience) {
  return {
    id: ++orderSeq,
    name: recipe.name,
    items: [...recipe.items],
    coins: recipe.coins,
    patience: patience ?? ORDER_PATIENCE,
    maxPatience: ORDER_PATIENCE,
  };
}

export function spawnOrder(state) {
  const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
  state.orders.push(makeOrder(recipe));
}

export function sameItems(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((item, i) => item === sortedB[i]);
}

function say(state, text) {
  state.message = text;
  state.messageTimer = 4;
}

export function startShift(state) {
  const fresh = createGame();
  Object.assign(state, fresh, { phase: 'playing' });
  spawnOrder(state);
  spawnOrder(state);
  say(state, 'Shift started! Fill the orders before customers walk out.');
}

export function addIngredient(state, id) {
  if (state.phase !== 'playing') return;
  if (id === 'patty') {
    if (state.grill.item) { say(state, 'Grill is busy — wait for the patty!'); return; }
    state.grill.item = 'patty';
    state.grill.progress = 0;
    say(state, 'Patty on the grill…');
    return;
  }
  if (state.plate.length >= 6) { say(state, 'The plate is full — serve it or clear it!'); return; }
  state.plate.push(id);
}

export function takeFromGrill(state) {
  if (state.phase !== 'playing') return;
  if (!state.grill.item) { say(state, 'Grill is empty — put a patty on it (key 2).'); return; }
  if (state.grill.progress < GRILL_TIME) { say(state, 'Still cooking… watch the grill bar!'); return; }
  if (state.plate.length >= 6) { say(state, 'The plate is full!'); return; }
  state.plate.push('patty');
  state.grill.item = null;
  state.grill.progress = 0;
  say(state, 'Cooked patty on the plate!');
}

export function undoPlate(state) {
  if (state.phase !== 'playing') return;
  const removed = state.plate.pop();
  if (removed) say(state, 'Took the ' + removed + ' off the plate.');
}

export function servePlate(state) {
  if (state.phase !== 'playing') return;
  if (state.plate.length === 0) { say(state, 'The plate is empty!'); return; }
  const index = state.orders.findIndex((order) => sameItems(order.items, state.plate));
  if (index >= 0) {
    const order = state.orders[index];
    const mult = 1 + Math.min(state.combo, 2);
    const earned = order.coins * mult;
    const bonus = Math.ceil(order.patience / 10);
    state.score += earned * 10 + bonus;
    state.coins += earned;
    state.served += 1;
    state.combo += 1;
    state.comboTimer = 20;
    state.orders.splice(index, 1);
    state.plate = [];
    say(state, 'Served ' + order.name + '! +' + earned + ' coins' + (mult > 1 ? ' (combo x' + mult + ')' : ''));
  } else {
    state.score = Math.max(0, state.score - 25);
    state.combo = 0;
    state.plate = [];
    say(state, 'Wrong dish! The customer refused it. -25 points.');
  }
}

function endShift(state, reason) {
  state.phase = 'over';
  state.results = { score: state.score, coins: state.coins, served: state.served, reason };
  say(state, reason);
}

export function updateGame(state, dt) {
  if (state.frozen || state.phase !== 'playing') return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    endShift(state, "Time's up — shift over!");
    return;
  }
  if (state.comboTimer > 0) {
    state.comboTimer -= dt;
    if (state.comboTimer <= 0) state.combo = 0;
  }
  if (state.messageTimer > 0) state.messageTimer -= dt;
  state.spawnTimer -= dt;
  if (state.orders.length < MAX_ORDERS && state.spawnTimer <= 0) {
    spawnOrder(state);
    state.spawnTimer = 7 + Math.random() * 3;
  }
  for (let i = state.orders.length - 1; i >= 0; i--) {
    const order = state.orders[i];
    order.patience -= dt;
    if (order.patience <= 0) {
      state.orders.splice(i, 1);
      state.hearts -= 1;
      state.combo = 0;
      say(state, 'A customer walked out! -1 heart.');
      if (state.hearts <= 0) {
        endShift(state, 'All customers walked out — shift over!');
        return;
      }
    }
  }
  if (state.grill.item && state.grill.progress < GRILL_TIME) {
    state.grill.progress += dt;
  }
}
