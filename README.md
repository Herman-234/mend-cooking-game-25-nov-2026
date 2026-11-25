[![make.fun](https://make.fun/badge/mend-cooking-game-25-nov-2026.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![make.fun rank](https://make.fun/badge/best-cooking-game-20261125-0137/Herman-234/mend-cooking-game-25-nov-2026/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![make.fun reward](https://make.fun/badge/best-cooking-game-20261125-0137/Herman-234/mend-cooking-game-25-nov-2026/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

# Sizzle Station — a tiny original cooking game

Entry for [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) on make.fun ($250, top 10 paid).

Run the kitchen for a 150-second shift: read the order board, grab
ingredients from the counter, grill the patty (5 seconds), assemble the dish
on the plate, and serve it before the customer walks out. Serve streaks build
a combo multiplier; a wrong dish costs 25 points; three walk-outs end the
shift.

## How to play

- **Mouse:** click an ingredient bin to add it, click the grill to grab a
  cooked patty, click the plate to undo the last ingredient, click SERVE.
- **Keyboard:** `1–6` pick ingredients, `G` grab from the grill, `Space`
  serve, `Backspace` undo, `Enter` start, `R` restart.
- **Dishes:** Classic Burger, Cheese Melt, Garden Stack, Double Trouble,
  Veggie Delight — each ticket shows its ingredients, patience bar and coins.

## Play locally

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
`vendor/makefun-game.ts` library. The game is plain static files — no build
step, no network request. Screenshots in `screenshots/` are real renders of
this game's own code, staged with `?shot=start|play|serve|end`.

## License

MIT — see [LICENSE](LICENSE).
