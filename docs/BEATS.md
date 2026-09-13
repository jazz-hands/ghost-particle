# Ghost Particle — Beat sheet

The moment-by-moment script. Nothing here is assumed; if it isn't written, it isn't built. Each beat lists what the player sees, what they do, what the neutrino does, the caption text, its fact IDs, and the sound cue.

## Blockout

The blockout builds every row's *Player sees*, *Player does*, *Caption*, and *Facts* columns and ignores the *Neutrino* and *Cue* columns: the neutrino is a plain translucent sphere with no animation, and sound is off. Grey primitives only: no materials, no lighting work, no assets, and no bloom beyond what the stage already has.

## Target lengths

Pacing is judged against these. A level that runs long is cut, not sped up.

| Level | Target |
|---|---|
| 1 Birth | 20 s |
| 2 Meet the neutrino | 30 s |
| 3 Escaping the Sun | 60 s |
| 4 The trip to Earth | 75 s |
| 5 Super-Kamiokande | 90 s |
| 6 Twenty-two years of watching | 60 s |
| Total | 5 min 35 s, about six minutes |

Caption rules: at most 40 words, plain language, every card that states a fact is tagged with F-IDs (D-002, D-015); pure instruction cards carry no tag. Cards are timed: each stays for 1 s plus 0.22 s per word while the action continues underneath, and pressing Space dismisses it early. Space is never also a hold key on a level that has cards; holds use the right arrow.

Rail rule (levels 3 and 4): the rail never slows for a card; steering stays live while a card is up.

Input map (D-010): Space = hold in level 1, continue elsewhere. Left/Right = steer in level 3, move the grid highlight in level 4. E / M = electron / muon in level 5. Escape = close a side panel. Mouse clicks also work on every DOM control, but nothing requires them.

Reduced motion: if the browser reports a reduced-motion preference, screen shake, idle bob and the level 3 rush blur are disabled; everything else is unchanged.

Counter display (F-32): three significant figures with a word scale ("about 190 quadrillion"), updated ten times a second. The clock starts on the first Space hold in level 1, which is also the gesture that unlocks audio.

## Reaction set

The character's whole expression vocabulary. Anything not listed is not animated.

| Name | What it looks like |
|---|---|
| wake | eyes closed, blink open, look left and right |
| wiggle | quick side-to-side jelly wobble, happy |
| nod | bob down and up twice |
| shrug | rise slightly, eyes turn to flat lines, settle |
| brace | squash flat, eyes squeeze shut (expecting impact) |
| surprised | pop back to round, eyes go wide |
| look-at-self | eyes glance down at own body |
| cheer | bounce up with a stretch, eyes become upward arcs (lower lid rises) |
| proud | slow bob, eyes half-closed and content |
| peek | tilt toward a UI element, one eye larger |
| wave | tilt and wobble at the player as a goodbye |

## Sound cue set

| Cue | Character |
|---|---|
| hum | low tone, pitch rises with the charge meter |
| crackle | short noisy burst |
| pop | soft bubble pop |
| chime | two-note bell |
| whoosh | filtered noise sweep |
| thwip | tiny high blip, played on every pass-through |
| tick | soft click for counters and meters |
| blip | UI confirm |
| buzz | UI wrong answer, gentle |
| swell | rising pad that peaks with the ring bloom |
| ta-da | three-note fanfare |

---

## Level 1 — Birth

Wordless except the key prompt and the title.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 1.1 | Black. A faint warm glow pulses at center. After 2 s a prompt fades in: "Hold Space". | waits | not yet present | none | | silent (audio cannot start before a key press) |
| 1.2 | On the first hold: audio unlocks, the counter clock starts (F-32), and two soft glowing blobs drift in from the edges: a small one (proton) and a larger one (beryllium-7). Unlabeled. The prompt hides while Space is held. | holds Space | | none | F-01, F-02 | hum starts, rises in pitch and volume with the meter |
| 1.3 | While held: blobs move together over 2.5 s. Nothing else on screen. | keeps holding | | none | | hum |
| 1.4 | If released early: blobs bounce apart and drift back to the edges, glow dims. "Hold Space" returns. | tries again | | none | | hum falls |
| 1.5 | Released at full: white flash. A single nucleus remains, jittering and wobbling (boron-8). | watches | | none | F-02 | crackle |
| 1.6 | After 1 s it pops into sparks. In the sparks, the neutrino fades in at its normal translucency (D-029). | watches | wake | none | | pop, then chime |
| 1.7 | Title fades in above it: "GHOST PARTICLE". Below: "Press Space". | presses Space | wiggle | none | | blip |

---

## Level 2 — Meet the neutrino

Camera pulls back; the neutrino floats in warm haze. The through-line counter fades in at the top corner, already counting since the first hold in level 1 (F-32). Exactly three cards.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 2.1 | Card 1. Counter appears: "Neutrinos through you since you started: …" | reads, presses Space | wiggle | "Meet a neutrino. Born a moment ago in the Sun's core, where it's about 15 million degrees." | F-03 | blip |
| 2.2 | Card 2. A seesaw appears. An electron (small solid ball) is placed on one side; the neutrino on the other. The electron side slams down; the neutrino floats up. | presses Space | shrug (while floating up) | "It has almost no mass. Weighed against an electron, it's over a million times lighter." | F-04 | pop on the slam |
| 2.3 | Card 3. Seesaw fades. The neutrino's glow brightens briefly. | presses Space | cheer | "No electric charge. Most solar neutrinos come from two protons squeezed together; you came from a rarer squeeze, with extra energy a detector can catch." | F-06, F-01, F-02 | chime |
| 2.4 | Corner button "Want more?" (level 7 only). Fade to level 3. | | | | F-26, F-27 | whoosh |

---

## Level 3 — Escaping the Sun: "try to hit something"

Camera behind the neutrino, rushing outward through orange-white haze. The neutrino cannot collide with anything; steering only changes its lane.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 3.1 | Rushing haze. Card: instruction. | reads, Space | nod | "You're leaving the Sun. Everything in here is packed tight. Try to hit something. Arrow keys to steer." | | whoosh |
| 3.2 | A plasma wall spans the whole screen. There is no gap. | steers anywhere | brace as the wall approaches, then surprised after passing | none until after | | thwip |
| 3.3 | Card, after the pass. | Space | surprised, then wiggle | "Nothing happened. The Sun is opaque to light, but almost transparent to you. Almost nothing can stop a neutrino." | F-10 | tick |
| 3.4 | A run of obstacles over ~20 s: dense knots of nuclei, more plasma walls, a wall of light. Some have gaps, most don't. | steers freely | brace/surprised on the first two, then just wiggle | none | | thwip each, tick |
| 3.5 | Card, mid-climb. Haze thins slightly. | Space | nod | "Light from the core takes tens of thousands of years or more to get out. It keeps bumping into things. You take about 2 seconds." | F-08, F-09 | |
| 3.6 | The neutrino's tint begins to shift. Flavor icon under the counter changes with it. Tint keeps cycling; obstacles thin out and the haze brightens toward the surface. | watches | look-at-self, then shrug | "Neutrinos come in three flavors: electron, muon, and tau. You were born electron-flavor. But look. You're changing. A neutrino can only change flavor if it has some mass. That's how we know you aren't weightless." | F-12, F-05 | rising tone |
| 3.7 | Burst out of the surface into black space. The Sun glares behind. | | cheer | none | | whoosh, ta-da |
| 3.8 | Corner button "Want more?" (level 7): who proved flavor change. | | | | F-13 | |

---

## Level 4 — The trip to Earth

Open space. Sun shrinking behind, Earth a dot ahead. Travel meter shows kilometers and light-seconds. Whole level ~60 s.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 4.1 | Meter appears: "0 km, 0 light-seconds". Card. | Space | nod | "150 million kilometers to Earth. Light takes about 8 minutes 20 seconds. So do you." | F-15 | tick |
| 4.2 | Meter ticks for about four flavor shifts (~6 s). Star streaks. Sun shrinks. | watches | wiggle | none | F-30 | tick |
| 4.3 | At ~40% of the trip the meter pauses. Card. | reads | nod | "Halfway to Earth. Before you arrive, meet the family: every particle matter is made of, on one chart." | F-16 | blip |
| 4.4 | After the card the neutrino drifts to the right and shrinks, as if zoomed out, to watch. A "family photo" grid builds on the left, one family row at a time (6 quarks, 6 leptons, 4 force carriers, Higgs), each row colour-coded (quarks rose, leptons cyan, force carriers green, Higgs gold) and announced by a one-line timed card (family lines below). Each tile has a name and a plain one-line label (table below); the three neutrino tiles show only a question mark. Then the card below appears; a highlight sits on the first tile, arrows move it, Space picks. Clicking a tile also works. | reads | peek at the grid, then wave | "This is the Standard Model, the list of everything matter is made of. Find yourself." | F-16 | blip |
| 4.5 | Wrong tile picked: it wiggles and its one-line label enlarges for 2 s. | picks | shrug | (the tile's own label) | F-16 | buzz |
| 4.6 | Right tile picked (any of the three neutrino tiles counts): the neutrino jumps into the tile. | picks | cheer | "Found you. You're one of the three neutrinos, in the lepton family, next to the electron." | F-16 | ta-da |
| 4.7 | Card slides out. The meter dashes the rest of the way in ~3 s; Earth grows to fill the view. | watches | proud | none | | tick rate follows speed |
| 4.8 | Dive: through clouds, over Japan, into a mountainside. Card. | | brace (playfully, then surprised, it passes through rock too) | "Arriving: Kamioka mine, Japan. 1,000 meters underground. Rock doesn't stop you either." | F-19 | whoosh, thwip |

### Level 4 family lines (F-16)

| Row | Line |
|---|---|
| Quarks | Quarks: the pieces inside protons and neutrons. |
| Leptons | Leptons: the electron and its cousins. |
| Force carriers | Force carriers: what pushes and pulls. |
| Higgs | The Higgs: where mass comes from. |

### Level 4 tile labels (F-16)

| Row | Tile | Label |
|---|---|---|
| Quarks | Up | Found inside every proton and neutron |
| Quarks | Down | Found inside every proton and neutron too |
| Quarks | Charm | A heavier cousin of Up |
| Quarks | Strange | A heavier cousin of Down |
| Quarks | Top | The heaviest particle known |
| Quarks | Bottom | A heavier cousin of Strange |
| Leptons | Electron | Orbits atoms and carries electricity |
| Leptons | Muon | A heavy electron that lives a few millionths of a second |
| Leptons | Tau | An even heavier electron, gone even faster |
| Leptons | Electron neutrino | ? |
| Leptons | Muon neutrino | ? |
| Leptons | Tau neutrino | ? |
| Force carriers | Photon | Carries light and the electric force |
| Force carriers | Gluon | Glues quarks together |
| Force carriers | W | Carries the weak force, which lets the Sun's fusion happen |
| Force carriers | Z | Carries the weak force too, the only force a neutrino feels besides gravity |
| Higgs | Higgs | Its field is what gives the other particles their mass |

After a correct click the three question marks are replaced with: "Ghost particles. Almost no mass, no charge, three flavors."

---

## Level 5 — Super-Kamiokande

Inside the tank. Dark water, gold sensor grid on every wall. Camera floats near the center.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 5.1 | Slow reveal of the cylinder. Card. | Space | wake (looks around, awed) | "Super-Kamiokande. A tank 39 meters wide and 41 meters tall, holding 50,000 tons of pure water. Running since 1996." | F-17, F-19 | hum (deep, watery) |
| 5.2 | Sensors glint in sequence around the wall. Card. | Space | peek | "11,129 light sensors line the inside, waiting for a flash. About 30 neutrinos a day give them one." | F-18, F-20 | tick sweep |
| 5.3 | **The hero's hit.** A single tiny electron drifts ahead in the water. Time slows. Prompt: "Press Space". | presses Space | brace | none | | swell begins |
| 5.4 | On press: the neutrino nudges the electron. The electron shoots forward. A blue cone of light grows from its path and hits the wall as a fuzzy ring. Sensors under the ring light up. | watches | surprised, then proud | none | F-21 | swell peaks, chime |
| 5.5 | Card, over the glowing ring. Counter still ticking. | Space | proud | "You hit something. You kicked an electron faster than light moves in water. That makes a cone of light. On the wall: a ring." | F-21, F-31 | |
| 5.6 | Card. Beside the hero's fuzzy ring, a sharp ring is drawn for comparison. | Space | look-at-self | "Your ring is fuzzy, because the electron scatters and showers. A muon would punch straight through and leave a sharp ring." | F-22 | |
| 5.7 | Mini-game intro. Two buttons appear, labelled with their keys: "E  Electron" and "M  Muon". Card. | Space | nod | "Now you're the physicist. Five more rings are coming. Sharp or fuzzy? Press E or M to sort them." | F-22 | blip |
| 5.8 | Rings 1–5, one at a time. Fixed set, in order: fuzzy, sharp, fuzzy, sharp, fuzzy-but-ambiguous. | presses E or M (or clicks) | peek at each ring | none until answered | F-22, F-31 | blip |
| 5.9 | After each answer: the ring is labeled, a one-line reason shows for 3 s (table below). | | nod on correct, shrug on wrong | (one line each, table below) | F-22 | chime / buzz |
| 5.10 | Card, after ring 5. | Space | nod | "Solar neutrinos show up as electron rings pointing away from the Sun. That's how Super-K knows they came from the Sun." | F-23 | |
| 5.11 | Card. Smaller type. | Space | | "These rings are simulated from Super-K's published shape and physics. They are not real recordings." | F-24, F-17, F-18 | |
| 5.12 | Corner button "Want more?" (level 7). | | | | F-28 | |

### Level 5 ring answers and reveal lines (F-22)

| Ring | Drawn as | Answer | Reveal line |
|---|---|---|---|
| 1 | soft, wide edge | Electron | "Blurry edge: an electron, scattering as it goes." |
| 2 | crisp thin edge | Muon | "Crisp edge: a muon, punching straight through." |
| 3 | soft, slightly smeared | Electron | "Soft, smeared ring: an electron shower." |
| 4 | crisp, partly cut by the tank edge | Muon | "Clean circle: a muon." |
| 5 | in between, deliberately ambiguous | Either counts | "Hard to call. Physicists flag these too, and some get sorted wrong." |

F-20 note (card 5.2, "about 30 neutrinos a day"): confirm the number against the source and the energy threshold it applies to before the card ships. If it cannot be confirmed, label it approximate.

---

## Level 6 — The Sun in neutrinos

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 6.1 | The tank fades to black. A dark square field, 90° across, centred on where the Sun is. Thousands of tiny dots land one at a time, each one a detected neutrino's direction in its flavor tint (D-011), slowly at first and then in a rush over ~9 s, until the Sun builds out of them at the centre over a speckled background. A line under the field says the map is simulated (F-34). The neutrino floats beside it. | watches | peek at the field as it fills | none | F-34, F-25 | hum (soft), tick per burst |
| 6.2 | Card, over the finished map. | | proud | "This is the Sun, seen in neutrinos. It took 503 days of watching. Some of these neutrinos arrived at night, after passing through the entire Earth." | F-25 | chime |
| 6.3 | Card. After it, the dots brighten into one warm glow over ~2.5 s. | | nod | "Nothing stopped them. Nothing stopped you." | F-10 | swell |
| 6.4 | The through-line counter stops, moves to center, grows large. | | peek | "And through you, since you pressed start:" (the number) | F-32 | tick, then chime |
| 6.5 | Credits roll, generated from FACTS.md: facts and sources, "made with" list, the tint disclaimer, the sky-map disclaimer, the counter's reference-person disclosure. "Play again" at the end. | scrolls, or waits | wave | none | all | ta-da |

The map is generated at run time from the shape in F-34; the 1998 photograph is never shipped (D-028).

---

## Level 7 — "Want more?" panels (only if time remains)

Each is a single panel opened from the corner button, closed with Escape. Three paragraphs at most, each tagged.

| Panel | Opens from | Content |
|---|---|---|
| The ghost is predicted | Level 2 | F-26, F-27 |
| Proving they change | Level 3 | F-13 |
| The missing neutrinos | Level 5 | F-28, F-29 |
