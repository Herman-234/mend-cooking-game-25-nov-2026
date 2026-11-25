// Sizzle Station — everything the player sees, drawn on one canvas:
// the kitchen, the order board, the ingredient counter, the grill, the
// assembly plate, the timer and the title / results overlays.
import { INGREDIENTS, GRILL_TIME } from './config.js';
import { sameItems } from './state.js';

const W = 960;
const H = 600;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align, bold) {
  ctx.fillStyle = color;
  ctx.font = (bold ? 'bold ' : '') + size + 'px system-ui, sans-serif';
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

export function drawIngredient(ctx, id, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  if (id === 'bun') {
    ctx.fillStyle = '#e8b96a';
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.55, s * 0.4, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(-s * 0.55, 0, s * 1.1, s * 0.16);
    ctx.fillStyle = '#fff3d6';
    for (const [dx, dy] of [[-0.25, -0.18], [0, -0.28], [0.25, -0.18]]) {
      ctx.beginPath(); ctx.ellipse(dx * s, dy * s, s * 0.05, s * 0.03, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'patty') {
    ctx.fillStyle = '#8a5a2b';
    roundRect(ctx, -s * 0.55, -s * 0.2, s * 1.1, s * 0.4, s * 0.12); ctx.fill();
    ctx.fillStyle = '#6b4420';
    for (const dx of [-0.3, 0, 0.3]) { ctx.beginPath(); ctx.arc(dx * s, 0, s * 0.05, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === 'cheese') {
    ctx.fillStyle = '#f5c542';
    ctx.beginPath(); ctx.moveTo(-s * 0.55, s * 0.25); ctx.lineTo(s * 0.55, s * 0.25); ctx.lineTo(0, -s * 0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d9a514';
    for (const [dx, dy] of [[-0.2, 0.05], [0.15, -0.05]]) { ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === 'lettuce') {
    ctx.fillStyle = '#58b368';
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = s * (0.42 + 0.12 * Math.sin(i * 3));
      const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.6;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#3d8a4c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, 0); ctx.lineTo(s * 0.3, 0); ctx.stroke();
  } else if (id === 'tomato') {
    ctx.fillStyle = '#e05252';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f08080';
    ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.12, s * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#58b368';
    ctx.beginPath(); ctx.ellipse(0, -s * 0.42, s * 0.14, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'onion') {
    ctx.strokeStyle = '#b388e0'; ctx.lineWidth = s * 0.1;
    for (const r of [0.42, 0.28, 0.14]) { ctx.beginPath(); ctx.arc(0, 0, s * r, 0, Math.PI * 2); ctx.stroke(); }
  }
  ctx.restore();
}

function drawOrderTicket(ctx, order, x, y, w, h, highlight) {
  ctx.fillStyle = highlight ? '#fff7d6' : '#fdf6e3';
  roundRect(ctx, x, y, w, h, 10); ctx.fill();
  ctx.strokeStyle = highlight ? '#e8a100' : '#d8c9a3'; ctx.lineWidth = highlight ? 3 : 1.5; ctx.stroke();
  text(ctx, order.name, x + 12, y + 18, 14, '#33302a', 'left', true);
  order.items.forEach((id, i) => drawIngredient(ctx, id, x + 26 + i * 34, y + 48, 15));
  text(ctx, order.coins + ' coins', x + 12, y + 66, 11, '#b8860b', 'left', true);
  const frac = Math.max(0, order.patience / order.maxPatience);
  ctx.fillStyle = '#e5ddd0';
  roundRect(ctx, x + 12, y + h - 12, w - 24, 6, 3); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#58b368' : frac > 0.25 ? '#e8a100' : '#e05252';
  if (frac > 0) { roundRect(ctx, x + 12, y + h - 12, (w - 24) * frac, 6, 3); ctx.fill(); }
}

function drawHearts(ctx, hearts, x, y) {
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < hearts ? '#e05252' : '#5a6b7a';
    const cx = x + i * 26, cy = y;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 7);
    ctx.bezierCurveTo(cx - 10, cy - 3, cx - 5, cy - 11, cx, cy - 4);
    ctx.bezierCurveTo(cx + 5, cy - 11, cx + 10, cy - 3, cx, cy + 7);
    ctx.fill();
  }
}

export function drawGame(ctx, state) {
  // Kitchen walls and floor.
  ctx.fillStyle = '#31404f'; ctx.fillRect(0, 0, W, 64);
  ctx.fillStyle = '#3d4f61'; ctx.fillRect(0, 64, W, 8);
  ctx.fillStyle = '#c9a06a'; ctx.fillRect(0, 72, W, H - 72);
  ctx.fillStyle = '#b98f5c';
  for (let y = 120; y < H; y += 48) ctx.fillRect(0, y, W, 2);
  for (let x = 0; x < W; x += 80) ctx.fillRect(x, 72, 2, H - 72);

  // Top bar: name, timer, score, coins, hearts.
  text(ctx, 'SIZZLE STATION', 16, 32, 20, '#ffd166', 'left', true);
  const mins = Math.floor(state.timeLeft / 60);
  const secs = Math.floor(state.timeLeft % 60);
  const timerText = mins + ':' + String(secs).padStart(2, '0');
  text(ctx, '⏱ ' + timerText, W / 2, 32, 24, state.timeLeft <= 30 ? '#ff6b6b' : '#ffffff', 'center', true);
  text(ctx, 'Score ' + state.score, W - 260, 24, 15, '#ffffff', 'left', true);
  text(ctx, 'Coins ' + state.coins + '  •  Served ' + state.served, W - 260, 46, 15, '#ffd166', 'left', true);
  drawHearts(ctx, state.hearts, W - 385, 32);
  if (state.combo > 1) text(ctx, 'COMBO x' + (1 + Math.min(state.combo, 2)), W / 2, 56, 13, '#ff9f1c', 'center', true);

  // Order board.
  ctx.fillStyle = '#26313d';
  roundRect(ctx, 16, 84, 560, 124, 12); ctx.fill();
  text(ctx, 'ORDER BOARD', 32, 102, 13, '#ffd166', 'left', true);
  if (state.orders.length === 0) {
    text(ctx, 'No orders yet — customers are coming…', 32, 150, 15, '#9fb2c3', 'left');
  }
  state.orders.forEach((order, i) => {
    const match = state.plate.length > 0 && sameItems(order.items, state.plate);
    drawOrderTicket(ctx, order, 32 + i * 176, 114, 164, 86, match);
  });

  // Tip box.
  ctx.fillStyle = '#26313d';
  roundRect(ctx, 592, 84, 352, 124, 12); ctx.fill();
  text(ctx, 'HOW TO COOK', 608, 102, 13, '#ffd166', 'left', true);
  text(ctx, '1  Click a bin (or keys 1–6) to add it.', 608, 126, 13, '#dfe9f2', 'left');
  text(ctx, '2  Patty goes on the grill first — it cooks', 608, 146, 13, '#dfe9f2', 'left');
  text(ctx, '     in 5s. Click the grill to grab it.', 608, 164, 13, '#dfe9f2', 'left');
  text(ctx, '3  Match a ticket, then SERVE (Space).', 608, 184, 13, '#dfe9f2', 'left');

  // Ingredient counter.
  ctx.fillStyle = '#4a3220';
  roundRect(ctx, 16, 216, 560, 130, 12); ctx.fill();
  text(ctx, 'INGREDIENTS — click or press 1–6', 32, 234, 13, '#ffd166', 'left', true);
  state.ui.bins = [];
  INGREDIENTS.forEach((ing, i) => {
    const x = 32 + i * 90, y = 246, w = 78, h = 86;
    ctx.fillStyle = '#fdf6e3';
    roundRect(ctx, x, y, w, h, 10); ctx.fill();
    ctx.strokeStyle = '#d8c9a3'; ctx.lineWidth = 1.5; ctx.stroke();
    drawIngredient(ctx, ing.id, x + w / 2, y + 32, 26);
    text(ctx, ing.name, x + w / 2, y + 66, 12, '#33302a', 'center', true);
    text(ctx, '[' + ing.key + ']', x + w / 2, y + 80, 10, '#8a7a5c', 'center');
    state.ui.bins.push({ x, y, w, h, id: ing.id });
  });

  // Grill.
  const gx = 592, gy = 216, gw = 170, gh = 130;
  ctx.fillStyle = '#22252a';
  roundRect(ctx, gx, gy, gw, gh, 12); ctx.fill();
  ctx.fillStyle = '#3a3f46';
  roundRect(ctx, gx + 10, gy + 26, gw - 20, gh - 40, 8); ctx.fill();
  text(ctx, 'GRILL', gx + 14, gy + 16, 13, '#ffd166', 'left', true);
  if (state.grill.item) {
    const done = state.grill.progress >= GRILL_TIME;
    drawIngredient(ctx, 'patty', gx + gw / 2, gy + 62, done ? 34 : 28);
    if (!done) {
      ctx.fillStyle = '#555';
      roundRect(ctx, gx + 16, gy + gh - 22, gw - 32, 10, 5); ctx.fill();
      ctx.fillStyle = '#ff9f1c';
      roundRect(ctx, gx + 16, gy + gh - 22, (gw - 32) * (state.grill.progress / GRILL_TIME), 10, 5); ctx.fill();
      text(ctx, 'cooking…', gx + gw / 2, gy + gh - 32, 11, '#ffb347', 'center');
    } else {
      text(ctx, 'READY — click to grab!', gx + gw / 2, gy + gh - 28, 12, '#7ee787', 'center', true);
    }
  } else {
    text(ctx, 'empty', gx + gw / 2, gy + 66, 14, '#8a94a3', 'center');
  }
  state.ui.grill = { x: gx, y: gy, w: gw, h: gh };

  // Assembly plate.
  const px = 778, py = 216, pw = 166, ph = 130;
  ctx.fillStyle = '#fdf6e3';
  roundRect(ctx, px, py, pw, ph, 12); ctx.fill();
  ctx.strokeStyle = '#d8c9a3'; ctx.lineWidth = 1.5; ctx.stroke();
  text(ctx, 'YOUR PLATE', px + 12, py + 16, 13, '#8a7a5c', 'left', true);
  ctx.fillStyle = '#e8e0d0';
  ctx.beginPath(); ctx.ellipse(px + pw / 2, py + 78, 62, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c9bda6'; ctx.stroke();
  state.plate.forEach((id, i) => {
    drawIngredient(ctx, id, px + pw / 2, py + 84 - i * 13, 22);
  });
  if (state.plate.length === 0) text(ctx, 'empty', px + pw / 2, py + 78, 13, '#a89a80', 'center');
  text(ctx, 'click plate: undo last', px + pw / 2, py + ph - 12, 10, '#8a7a5c', 'center');
  state.ui.plate = { x: px, y: py, w: pw, h: ph };

  // Serve button + message.
  const bx = 330, by = 380, bw = 300, bh = 64;
  const ready = state.plate.length > 0 && state.orders.some((o) => sameItems(o.items, state.plate));
  ctx.fillStyle = ready ? '#2f9e44' : '#3f7d4e';
  roundRect(ctx, bx, by, bw, bh, 14); ctx.fill();
  ctx.strokeStyle = ready ? '#7ee787' : '#6a9a76'; ctx.lineWidth = ready ? 3 : 1.5; ctx.stroke();
  text(ctx, ready ? 'SERVE IT!  (Space)' : 'SERVE  (Space)', bx + bw / 2, by + bh / 2, 22, '#ffffff', 'center', true);
  state.ui.serve = { x: bx, y: by, w: bw, h: bh };

  text(ctx, state.message, W / 2, 480, 16, ready ? '#7ee787' : '#ffffff', 'center', true);
  text(ctx, 'Keys 1–6 ingredients · G grab patty · Backspace undo · R restart', W / 2, 516, 13, '#e8dcc8', 'center');

  if (state.phase === 'title') drawTitle(ctx, state);
  if (state.phase === 'over') drawResults(ctx, state);
}

function drawTitle(ctx, state) {
  ctx.fillStyle = 'rgba(20, 24, 29, 0.82)';
  ctx.fillRect(0, 0, W, H);
  text(ctx, 'SIZZLE STATION', W / 2, 180, 54, '#ffd166', 'center', true);
  text(ctx, 'A tiny original cooking game — run the kitchen, beat the clock.', W / 2, 228, 18, '#ffffff', 'center');
  text(ctx, 'Fill every order ticket before the customer walks out.', W / 2, 258, 16, '#dfe9f2', 'center');
  text(ctx, 'Patty must grill 5 seconds. Match a ticket exactly, then SERVE.', W / 2, 282, 16, '#dfe9f2', 'center');
  ctx.fillStyle = '#2f9e44';
  roundRect(ctx, W / 2 - 150, 320, 300, 60, 14); ctx.fill();
  text(ctx, 'START SHIFT  (Enter)', W / 2, 350, 20, '#ffffff', 'center', true);
  text(ctx, 'Mouse + keyboard · 150-second shift · 3 hearts', W / 2, 420, 14, '#9fb2c3', 'center');
}

function drawResults(ctx, state) {
  ctx.fillStyle = 'rgba(20, 24, 29, 0.82)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#26313d';
  roundRect(ctx, W / 2 - 230, 150, 460, 260, 16); ctx.fill();
  ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, 'SHIFT OVER!', W / 2, 190, 34, '#ffd166', 'center', true);
  text(ctx, state.results ? state.results.reason : '', W / 2, 226, 15, '#dfe9f2', 'center');
  text(ctx, 'Dishes served:  ' + state.served, W / 2, 272, 20, '#ffffff', 'center', true);
  text(ctx, 'Coins earned:  ' + state.coins, W / 2, 306, 20, '#ffd166', 'center', true);
  text(ctx, 'Final score:  ' + state.score, W / 2, 340, 22, '#7ee787', 'center', true);
  text(ctx, 'Press R to cook another shift', W / 2, 384, 14, '#9fb2c3', 'center');
}
