# Known Issues & Improvements

## 🎨 Art & Visuals

### [ART-1] World and character artwork needs improvement
The current world uses plain colored rectangles/graphics primitives and emoji sprites. Needs:
- Proper tilesheet for the jungle world (trees, grass, path, rocks, decorations)
- Actual dino sprites for NPCs (world + battle views)
- Player character sprite
- Battle arena background art

Options: Kenney.nl free asset packs, OpenGameArt.org, or commission/generate pixel art.

---

## 📖 Word Pairings

### [WORD-1] Word–counter pairings don't make intuitive sense
Some pairings are confusing — a child who reads the attack word correctly still can't work out the right answer because the logic isn't clear.

**Examples of bad pairings found in testing:**
- `nap` → `jump` (makes no sense)
- `dig` → `jump` (unclear)
- `bit` → `run` (plausible but weak)
- `tip` → `jump` (unclear)
- `ran` → `jump` (unclear)

**Notes on fixing:**
- The counter must be *contextually obvious* once the word is read correctly — if you read "STOMP" you know to JUMP; if you read "CHOMP" you know to DODGE
- CVC words at stage 1 are hard to pair intuitively (most CVC words aren't action verbs with an obvious physical counter)
- May need to rethink stage 1 words entirely, or accept that stage 1 pairs are looser and only tighten from stage 2 up
- Some known good pairings: STOMP→JUMP, CHOMP→DODGE, WHIP→DUCK, SNAP→DODGE, SLAM→DODGE, THUD→JUMP

**Approach:** Audit every entry in `src/data/words.json` and rewrite counters so a child who reads the word correctly would naturally know what to do.

---

## 🐛 Bugs

### [BUG-1] Player resets to bottom of map after each battle
After winning a battle and returning to the world scene, `this.scene.restart()` is called in `refreshNPCs()`, which resets the player's position to the spawn point (x:400, y:520 — bottom center). The player should return to roughly where they were standing when the encounter started.

**Fix:** Store player position before launching the battle scene, then pass it back via the resume data so WorldScene can reposition the player on return.

### [BUG-2] Player can't dismiss dialog / escape an encounter
Once a dino's dialog starts, the wrong-choice path only shows additional text — it never gives the player a way to close the dialog and go back to exploring. For Spiky (and others with a decline option), clicking the "wrong" button shows a response but there's no escape route. The player is stuck until they click the correct path into battle.

**Fix options:**
- Add an explicit "← Back" / ESC button to the dialog panel that dismisses it and resumes the world scene
- Make wrong-path loops eventually offer a clean exit ("Maybe later… [Leave]")
- Hook the Escape key to close the dialog panel

---

## 💡 Future Ideas (not urgent)

- Sound effects for battle hits, wins, wrong answers
- Animated dino sprites (idle bounce, attack flash)
- More dinos on the map (expand beyond 3)
- Parent dashboard showing stage progress over time
- Stages 5–8 word content (r-controlled vowels, vowel teams)
