# Dino Reading RPG 🦕

A desktop browser RPG for an 8-year-old with dyslexia. This is a real game — not a reading exercise dressed up as one. Reading is the core mechanic of play, not a sidebar to it.

**Play it:** https://reading-ruddy.vercel.app

---

## How it works

The player explores a prehistoric jungle, approaches dinosaurs, reads their dialog, and battles them. To win a battle, the player reads the dino's attack word and picks the correct counter-action. Win the battle, befriend the dinosaur.

- **Dialog:** Read what the dino says, pick a response. Wrong choice leads to a funny consequence and loops back — no dead ends, no failure states.
- **Battle:** The dino attacks with a word (e.g. STOMP). The player reads it and picks the right move (e.g. JUMP). Correct answer chips away the dino's HP. Wrong answer shakes the screen — the player always gets another try.
- **Collection:** Befriended dinos are added to a collection with fun facts.

## Dyslexia support

- **OpenDyslexic font** throughout — all dialog, battle words, UI labels
- **Phoneme color-coding** on all words: each phoneme chunk is highlighted in a distinct background color to help break words into sounds
- **No time pressure** — the player can take as long as they need to read each word
- **No failure states** — wrong answers always lead somewhere, never to a dead end

## OG progression

Attack words follow the [UFLI](https://ufli.education.ufl.edu/) K-2 Scope & Sequence (Orton-Gillingham based). The game silently adjusts word difficulty based on the player's performance:

| Stage | Pattern | Examples |
|---|---|---|
| 1 | Basic CVC | bit, hop, ran |
| 2 | CCVC / CVCC blends | snap, grip, flap |
| 3 | Longer blends | stomp, grunt, clunk |
| 4 | Digraphs: sh, ch, th, wh | chomp, thud, whip |

After every 10 battle exchanges, accuracy is evaluated using a rolling window:
- ≥ 80% correct → advance one stage
- < 50% correct → drop one stage
- No notification shown — the words just get slightly harder or easier

## Tech stack

| Layer | Tech |
|---|---|
| Game engine | Phaser 3 |
| UI overlay | HTML/CSS (dialog and battle panels rendered in the DOM, not on canvas) |
| Font | OpenDyslexic (self-hosted, works offline) |
| Word database | JSON file, ships with the game |
| Progress tracking | localStorage — no login, no account |
| Build tool | Vite |
| Tests | Vitest |
| Deployment | Vercel |

No backend. No account creation. No internet required after first load.

## Project structure

```
src/
  data/
    words.json          # UFLI word database (stages 1–4)
    dinos.json          # Dino definitions, dialog, battle data
  scenes/
    BootScene.js        # Asset preload → WorldScene
    WorldScene.js       # Top-down map, player movement, NPC triggers
    BattleScene.js      # Battle loop, progression evaluation
  systems/
    storage.js          # localStorage persistence
    progression.js      # Rolling-window OG stage evaluation
  ui/
    overlay.js          # DOM panel mount/unmount helpers
    DialogPanel.js      # NPC dialog with choice flow
    BattlePanel.js      # HP bars, attack word, choice buttons
    CollectionPanel.js  # Befriended dino cards
    EndPanel.js         # Celebration screen
  utils/
    phonemeRenderer.js  # HTML spans with phoneme highlight colors
tests/
  storage.test.js
  progression.test.js
  phonemeRenderer.test.js
public/
  fonts/               # Self-hosted OpenDyslexic
  assets/sprites/      # Dino and player sprites
```

## Development

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # run all tests
npm run build    # production build
```

## Controls

- **Arrow keys** or **WASD** — move the explorer
- **Click** — select dialog choices and battle actions
- **📋 button** (top right) — open dino collection
