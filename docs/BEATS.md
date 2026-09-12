# Ghost Particle — Beat sheet

The moment-by-moment script. Nothing here is assumed; if it isn't written, it isn't built. Each beat lists what the player sees, what they do, what the neutrino does, the caption text, its fact IDs, and the sound cue.

Caption rules: at most 25 words, plain language, every card tagged with F-IDs (D-002, D-015). "Continue" always means pressing Space.

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
| cheer | bounce up with a stretch, eyes become arcs |
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
| 1.1 | Black. A faint warm glow pulses at center. After 2 s a prompt fades in: "Hold Space". | waits | not yet present | none | | hum (idle, quiet) |
| 1.2 | Two soft glowing blobs drift in from the edges: a small one (proton) and a larger one (beryllium-7). Unlabeled. A thin meter appears under them. | holds Space | | none | F-01, F-02 | hum rises in pitch and volume with the meter |
| 1.3 | While held: blobs move together, meter fills over 2.5 s, gentle screen shake grows. | keeps holding | | none | | hum |
| 1.4 | If released early: blobs bounce apart, meter drains, glow dims. Prompt returns. No words. | tries again | | none | | hum falls |
| 1.5 | Released at full: white flash. A single nucleus remains, jittering and wobbling (boron-8). | watches | | none | F-02 | crackle |
| 1.6 | After 1 s it pops into sparks. In the sparks, the neutrino fades in at 50% opacity. | watches | wake | none | | pop, then chime |
| 1.7 | Title fades in above it: "GHOST PARTICLE". Below: "Press Space". | presses Space | wiggle | none | | blip |

---

## Level 2 — Meet the neutrino

Camera pulls back; the neutrino floats in warm haze. The through-line counter fades in at the top corner and starts ticking (F-32). Exactly three cards.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 2.1 | Card 1. Counter appears: "Neutrinos through you since you started: …" | reads, presses Space | wiggle | "Meet a neutrino. Born a moment ago in the Sun's core, where it's about 15 million degrees." | F-03 | blip, tick loop starts |
| 2.2 | Card 2. A seesaw appears. An electron (small solid ball) is placed on one side; the neutrino on the other. The electron side slams down; the neutrino floats up. | presses Space | shrug (while floating up) | "It has almost no mass. Weighed against an electron, it's over a million times lighter." | F-04 | pop on the slam |
| 2.3 | Card 3. Seesaw fades. The neutrino's glow brightens briefly. | presses Space | cheer | "No electric charge. And thanks to the rare way it was born, extra energy. That energy is why a detector on Earth might catch it." | F-06, F-02 | chime |
| 2.4 | Corner button "Want more?" (level 7 only). Fade to level 3. | | | | F-26, F-27 | whoosh |

---

## Level 3 — Escaping the Sun: "try to hit something"

Camera behind the neutrino, rushing outward through orange-white haze. The neutrino cannot collide with anything; steering only changes its lane. A "Passed through" tally sits under the counter.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 3.1 | Rushing haze. Card: instruction. | reads, Space | nod | "You're leaving the Sun. Everything in here is packed tight. Try to hit something. Arrow keys to steer." | | whoosh |
| 3.2 | A plasma wall spans the whole screen. There is no gap. | steers anywhere | brace as the wall approaches, then surprised after passing | none until after | | thwip |
| 3.3 | Card, after the pass. Tally appears: "Passed through: 1". | Space | surprised, then wiggle | "Nothing happened. The Sun is opaque to light, but almost transparent to you. Almost nothing can stop a neutrino." | F-10 | tick |
| 3.4 | A run of obstacles over ~20 s: dense knots of nuclei, more plasma walls, a wall of light. Some have gaps, most don't. Tally climbs on each. | steers freely | brace/surprised on the first two, then just wiggle | none | | thwip each, tick |
| 3.5 | Card, mid-climb. Haze thins slightly. | Space | nod | "Light from the core takes tens of thousands of years or more to get out. It keeps bumping into things. You take about 2 seconds." | F-08, F-09 | |
| 3.6 | The neutrino's tint begins to shift. Flavor icon under the counter changes with it. | watches | look-at-self | "Neutrinos come in three flavors: electron, muon, and tau. You were born electron-flavor. But look. You're changing." | F-12 | rising tone |
| 3.7 | Card. Tint keeps cycling. | Space | shrug | "A neutrino can only change flavor if it has some mass. That's how we know you aren't weightless." | F-05 | |
| 3.8 | Card. Obstacles thin out; haze brightens toward the surface. | Space | nod | "Of boron-8 neutrinos born electron-flavor like you, only about a third still look that way when they reach Earth." | F-14 | |
| 3.9 | Burst out of the surface into black space. The Sun glares behind. Tally final value shown once, big. | | cheer | none | | whoosh, ta-da |
| 3.10 | Corner button "Want more?" (level 7): who proved flavor change. | | | | F-13 | |

---

## Level 4 — The trip to Earth

Open space. Sun shrinking behind, Earth a dot ahead. Travel meter shows kilometers and light-seconds. Whole level ~60 s.

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 4.1 | Meter appears: "0 km · 0 light-seconds". Card. | Space | nod | "150 million kilometers to Earth. Light takes about 8 minutes 20 seconds. So do you. Hold Space to fast-forward." | F-15 | tick |
| 4.2 | Meter ticks. Holding Space speeds the meter and the star streaks. Sun shrinks. | holds Space at will | wiggle faster when fast-forwarding | none | F-30 | tick rate follows speed |
| 4.3 | At ~40% of the trip the meter pauses. A "family photo" card slides in: a grid of 17 tiles in four rows (6 quarks, 6 leptons, 4 force carriers, Higgs), each with a name and a plain one-line label (table below). The three neutrino tiles show only a question mark. | reads | peek at the card | "This is the Standard Model, the list of everything matter is made of. Find yourself." | F-16 | blip |
| 4.4 | Wrong tile clicked: it wiggles and its one-line label enlarges for 2 s. | clicks | shrug | (the tile's own label) | F-16 | buzz |
| 4.5 | Right tile clicked (any of the three neutrino tiles counts): the neutrino jumps into the tile. | clicks | cheer | "Found you. You're one of the three neutrinos, in the lepton family, next to the electron." | F-16 | ta-da |
| 4.6 | Card slides out. Meter resumes. Earth grows to fill the view. | Space or wait | proud | none | | tick |
| 4.7 | Dive: through clouds, over Japan, into a mountainside. Card. | | brace (playfully, then surprised, it passes through rock too) | "Arriving: Kamioka mine, Japan. 1,000 meters underground. Rock doesn't stop you either." | F-19 | whoosh, thwip |

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
| 5.7 | Mini-game intro. Two buttons appear: "Electron" and "Muon". Card. | Space | nod | "Now you're the physicist. Five more rings are coming. Sharp or fuzzy? Sort them." | F-22 | blip |
| 5.8 | Rings 1–5, one at a time. Fixed set, in order: fuzzy, sharp, fuzzy, sharp, fuzzy-but-ambiguous. | clicks Electron or Muon | peek at each ring | none until answered | F-22, F-31 | blip |
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

---

## Level 6 — Twenty-two years of watching

| # | Player sees | Player does | Neutrino | Caption | Facts | Cue |
|---|---|---|---|---|---|---|
| 6.1 | The tank fades to black. A chart draws itself left to right over ~6 s: Super-K's public solar neutrino record, one point with error bars for every five days, 1996 to 2018 (A-02). Axis labels in plain words: "Year" and "Neutrinos from the Sun caught per second, per square centimetre (millions)". Credit line beneath. The neutrino floats beside it. | | peek at the chart as it draws | none | F-24 | hum (soft), tick per year |
| 6.2 | Card. | Space | proud | "This is 22 years of Super-Kamiokande watching the Sun, one dot for every five days. Each dot counts neutrinos like you." | F-24 | |
| 6.3 | Card. | Space | nod | "Many of those arrived at night, through the whole Earth. Nothing stopped them. Nothing stopped you." | F-25, F-10 | |
| 6.4 | Card. A faint yearly wave is highlighted on the chart. | Space | look-at-self | "The only pattern in all those years is a gentle yearly wobble, because Earth's orbit is slightly oval." | F-33 | |
| 6.5 | The through-line counter stops, moves to center, grows large. | | peek | "And through you, since you pressed start:" (the number) | F-32 | tick, then chime |
| 6.6 | Credits roll, generated from FACTS.md: facts and sources, the dataset credit, "made with" list, the tint disclaimer, the counter's reference-person disclosure. "Play again" at the end. | scrolls, or waits | wave | none | all | ta-da |

The chart is generated from the real data file (F-24) at build time. Consult the `dataviz` skill before writing the chart code.

---

## Level 7 — "Want more?" panels (only if time remains)

Each is a single panel opened from the corner button, closed with Escape. Three paragraphs at most, each tagged.

| Panel | Opens from | Content |
|---|---|---|
| The ghost is predicted | Level 2 | F-26, F-27 |
| Proving they change | Level 3 | F-13 |
| The missing neutrinos | Level 5 | F-28, F-29 |
