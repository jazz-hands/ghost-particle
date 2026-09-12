# Ghost Particle — Facts, figures, formulas and image credits

The single source of truth for everything factual the player sees. The spec, captions, code, and credits reference these by ID. Do not restate a number anywhere else; link the ID.

Status meanings:
- **verified** — checked against the listed source during planning.
- **check** — believed correct, must be confirmed against the listed source before it goes on screen.
- **avoid** — popular claim we are choosing not to use unless a primary source is found.

Each entry: plain-language wording (what the player reads), precise statement (for the team), sources, status, where used.

---

## Birth and the Sun

### F-01 The proton-proton reaction
- Player wording: "The Sun makes most of its energy, and most of its neutrinos, by squeezing two hydrogen nuclei (protons) together."
- Precise: p + p → ²H + e⁺ + νₑ. First step of the pp chain, which produces the large majority of the Sun's energy and neutrino output.
- Sources: Bahcall, J. N., *Neutrino Astrophysics* (Cambridge, 1989); Borexino Collaboration, "Neutrinos from the primary proton–proton fusion process in the Sun", *Nature* 512, 383 (2014).
- Status: check (pin exact page/figure).
- Used: L1, L2.

### F-02 The boron-8 branch
- Player wording: "A rarer branch of the same chain makes a nucleus called boron-8, which falls apart almost instantly and lets out a much more energetic neutrino. Those are the ones big detectors can catch."
- Precise: ppIII branch: ⁷Be + p → ⁸B + γ; ⁸B → ⁸Be* + e⁺ + νₑ. ⁸B neutrinos have a continuous spectrum up to roughly 15 MeV. pp neutrinos have a maximum energy of 0.42 MeV, below Super-Kamiokande's analysis threshold.
- Sources: Bahcall (1989); Super-Kamiokande Collaboration, "Solar neutrino measurements in Super-Kamiokande-IV", *Phys. Rev. D* 94, 052010 (2016), arXiv:1606.07538.
- Status: check (endpoint values).
- Used: L1, L2, L5.

### F-03 Core temperature
- Player wording: "The Sun's core is about 15 million degrees."
- Precise: central temperature ≈ 15.7 × 10⁶ K (standard solar model).
- Sources: NASA Sun Fact Sheet, https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
- Status: check.
- Used: L2.

### F-04 How light neutrinos are
- Player wording: "It has mass, but so little that the best lab measurement can only say it is less than 0.45 electronvolts. That is over a million times lighter than an electron."
- Precise: KATRIN 90% CL upper limit on the effective electron antineutrino mass: m < 0.45 eV (259 days of data). Electron mass 0.511 MeV, ratio > 1.1 × 10⁶.
- Sources: KATRIN Collaboration, "Direct neutrino-mass measurement based on 259 days of KATRIN data", *Science* 388, 180 (2025), https://www.science.org/doi/10.1126/science.adq9592 ; electron mass: PDG, https://pdg.lbl.gov
- Status: verified (KATRIN); check (PDG electron mass citation).
- Used: L2.

### F-05 Neutrinos do have mass
- Player wording: "We know it isn't weightless, because a weightless neutrino could never change flavor."
- Precise: neutrino oscillation requires non-zero mass differences; Δm²₃₁ ≈ 2.5 × 10⁻³ eV² implies at least one mass state ≳ 0.05 eV.
- Sources: PDG review "Neutrino Masses, Mixing, and Oscillations", https://pdg.lbl.gov
- Status: check.
- Used: L3.

### F-06 No electric charge
- Player wording: "It has no electric charge, so electric and magnetic forces ignore it."
- Precise: neutrinos are electrically neutral leptons interacting only via the weak force (and gravity).
- Sources: PDG.
- Status: check.
- Used: L2.

### F-07 How many pass through you
- Player wording: "Tens of billions of solar neutrinos pass through every square centimeter of you every second."
- Precise: total solar neutrino flux at Earth ≈ 6 × 10¹⁰ cm⁻² s⁻¹, dominated by pp neutrinos (≈ 5.9–6.0 × 10¹⁰ cm⁻² s⁻¹ in standard solar models). ⁸B flux ≈ 5 × 10⁶ cm⁻² s⁻¹.
- Sources: Bahcall, J. N., Serenelli, A. M., Basu, S., *Astrophys. J.* 621, L85 (2005); SNO Collaboration total ⁸B flux, *Phys. Rev. C* 88, 025501 (2013).
- Status: check (pin the exact model values used).
- Used: L2.

### F-08 How long light takes to escape the Sun
- Player wording: "Light made in the core takes tens of thousands of years or more to reach the surface, because it keeps bumping into matter."
- Precise: radiative diffusion time from core to surface; published estimates range from about 10⁴ to 1.7 × 10⁵ years depending on assumptions. We deliberately say "tens of thousands of years or more".
- Sources: Mitalas, R. & Sills, K. R., "On the photon diffusion time scale for the Sun", *Astrophys. J.* 401, 759 (1992).
- Status: check.
- Used: L3.

### F-09 How long a neutrino takes
- Player wording: "A neutrino crosses the whole Sun in about 2 seconds."
- Precise: solar radius 6.96 × 10⁵ km / c = 2.3 s.
- Sources: solar radius, NASA Sun Fact Sheet; formula F-30.
- Status: verified (arithmetic); check (radius citation).
- Used: L3.

### F-10 Almost nothing stops it
- Player wording: "The Sun is opaque to light but almost transparent to neutrinos."
- Precise: typical neutrino cross-sections at MeV energies are of order 10⁻⁴⁴ cm², giving mean free paths in solar matter enormously larger than the solar radius.
- Sources: Bahcall (1989).
- Status: check.
- Used: L3.

### F-11 "A light-year of lead"
- Popular claim: it would take a light-year of lead to stop half of a beam of neutrinos.
- Status: avoid. Order-of-magnitude folklore; use only if a primary source with stated energy is found.

---

## Flavors and flavor change

### F-12 Three flavors
- Player wording: "Neutrinos come in three kinds, called flavors: electron, muon, and tau. The Sun makes electron-flavor ones."
- Precise: νₑ, ν_μ, ν_τ. Solar fusion produces νₑ only.
- Sources: PDG.
- Status: check.
- Used: L3, L4.

### F-13 Flavor change was discovered by Super-K and SNO
- Player wording: "In 1998 Super-Kamiokande showed neutrinos change flavor. In 2001–2002 SNO in Canada showed the Sun's missing neutrinos had just changed flavor. The 2015 Nobel Prize in Physics went to Takaaki Kajita and Arthur McDonald for this."
- Precise: Super-K atmospheric oscillation evidence, *Phys. Rev. Lett.* 81, 1562 (1998); SNO flavor-change evidence, *Phys. Rev. Lett.* 89, 011301 (2002).
- Sources: Nobel Prize in Physics 2015, https://www.nobelprize.org/prizes/physics/2015/summary/
- Status: check.
- Used: L3, L7.

### F-14 About a third arrive as electron flavor (boron-8 only)
- Player wording: "Of the boron-8 neutrinos born electron-flavor, only about a third still look electron-flavor when they reach Earth."
- Precise: νₑ survival probability for ⁸B neutrinos ≈ 0.3 (matter-enhanced conversion in the Sun, the MSW effect). Super-K measures a data/unoscillated ratio ≈ 0.3.
- Sources: Super-Kamiokande Collaboration, arXiv:1606.07538; arXiv:2512.19887 (ratio 0.307 in 2.99–3.49 MeV bin).
- Status: verified (ratio); check (the general ≈0.3 statement).
- Used: L3.

---

## The trip

### F-15 Sun to Earth
- Player wording: "The Sun is about 150 million kilometers away. Light and neutrinos take about 8 minutes 20 seconds to cover it."
- Precise: 1 au = 149,597,870.7 km; t = 1 au / c = 499.0 s.
- Sources: IAU 2012 definition of the astronomical unit; c = 299,792.458 km/s (SI).
- Status: verified (arithmetic).
- Used: L4.

### F-16 The Standard Model family
- Player wording: "The Standard Model is the list of basic ingredients: 6 quarks, 6 leptons (three of them neutrinos), 4 force carriers, and the Higgs."
- Precise: quarks u, d, c, s, t, b; leptons e, μ, τ, νₑ, ν_μ, ν_τ; gauge bosons γ, g, W, Z; Higgs H.
- Sources: PDG; CERN, https://home.cern/science/physics/standard-model
- Status: check.
- Used: L4.

---

## Super-Kamiokande

### F-17 Size and water
- Player wording: "A steel tank 39 meters wide and 41 meters tall, holding 50,000 tons of ultra-pure water."
- Precise: cylinder 39.3 m diameter × 41.4 m height; 50 kton water.
- Sources: Super-Kamiokande official site, https://www-sk.icrr.u-tokyo.ac.jp/en/sk/about/detector/
- Status: verified.
- Used: L5.

### F-18 Light sensors
- Player wording: "The inside is lined with 11,129 light sensors, each 20 inches across, and 1,885 more on the outside."
- Precise: inner detector 11,129 inward-facing 20-inch (50 cm) PMTs; outer detector 1,885 outward-facing 8-inch (20 cm) PMTs. (Original 1996 count was 11,146; current count is post-2006 rebuild.)
- Sources: Super-Kamiokande official site (above).
- Status: verified.
- Used: L5.

### F-19 Where and since when
- Player wording: "It sits 1,000 meters under a mountain in the Kamioka mine, Gifu, Japan, and has been running since 1996."
- Precise: 1,000 m rock overburden; Kamioka mine, Hida City, Gifu Prefecture; operations began April 1996.
- Sources: Super-Kamiokande official site (above).
- Status: verified.
- Used: L5.

### F-20 How many it catches
- Player wording: "It catches about 30 neutrinos a day."
- Precise: official site states approximately 30 neutrino events per day (all sources), against about 2 cosmic-ray muons per second.
- Sources: Super-Kamiokande official site (above).
- Status: verified.
- Used: L5.

### F-21 Cherenkov light and rings
- Player wording: "When a neutrino does hit, it kicks a charged particle to faster than light moves in water. That makes a cone of light, which hits the wall as a ring."
- Precise: Cherenkov radiation, cos θ = 1/(nβ); for water n ≈ 1.33 and β ≈ 1, θ ≈ 41–42°.
- Sources: PDG review "Passage of Particles Through Matter"; Super-Kamiokande official site.
- Status: check.
- Used: L5. Formula F-31.

### F-22 Electron rings are fuzzy, muon rings are sharp
- Player wording: "An electron scatters and showers, so its ring is fuzzy. A muon punches straight through, so its ring is sharp. Physicists sort events this way, and some are hard to call."
- Precise: e-like vs μ-like particle identification from ring edge sharpness; misidentification is non-zero, especially at lower energies.
- Sources: T2K, "Super-Kamiokande event displays", https://t2k-experiment.org/super-kamiokande-event-displays/ ; Super-Kamiokande Collaboration atmospheric analysis papers.
- Status: check (pin an SK collaboration paper).
- Used: L5.

### F-23 Solar neutrinos in Super-K
- Player wording: "Solar neutrinos show up as electron rings pointing away from the Sun."
- Precise: detected via elastic scattering ν + e⁻ → ν + e⁻; recoil electron direction correlates with the Sun's direction; analysis threshold 3.49 MeV recoil kinetic energy (SK-IV), with newer work reaching down to 2.99 MeV.
- Sources: arXiv:1606.07538; arXiv:2512.19887.
- Status: verified.
- Used: L5.

### F-24 Public Super-K solar data
- What exists: a public dataset of the ⁸B solar neutrino flux in 5-day bins, April 1996 to May 2018 (SK-I to SK-IV). Raw per-event data are not public.
- Sources: referenced in arXiv:2402.11258; locate the official download page on the SK site.
- Status: check (find the URL).
- Used: L5 honesty note, L6, credits.

---

## The Sun in neutrinos

### F-25 The neutrino picture of the Sun
- Player wording: "This is the Sun, seen in neutrinos. It took 503 days of watching. Some of these neutrinos arrived at night, after passing through the entire Earth."
- Precise: Super-Kamiokande solar neutrino sky map, 503 days exposure, 90° × 90° field centered on the Sun.
- Sources: NASA APOD 1998 June 5, https://science.nasa.gov/image-article/apod-1998-june-05-neutrinos-in-the-sun/ ; HEASARC, https://heasarc.gsfc.nasa.gov/docs/objects/heapow/archive/solar_system/superk_sun.html
- Image credit: R. Svoboda and K. Gordan (Louisiana State University), Super-Kamiokande Collaboration.
- Status: verified (credit and exposure); usage rights not yet confirmed.
- Used: L6.

---

## History (side panels)

### F-26 Prediction and naming
- Player wording: "In 1930 Wolfgang Pauli proposed an unseen particle to explain missing energy in radioactive decays. Enrico Fermi gave it the name neutrino, 'little neutral one'."
- Sources: Nobel Prize outreach / CERN history pages.
- Status: check.
- Used: L7.

### F-27 First detection
- Player wording: "It was first detected in 1956 by Clyde Cowan and Frederick Reines, using a nuclear reactor. Reines received the 1995 Nobel Prize."
- Sources: Cowan et al., *Science* 124, 103 (1956); Nobel Prize in Physics 1995.
- Status: check.
- Used: L7.

### F-28 The solar neutrino problem
- Player wording: "From the late 1960s, Ray Davis's experiment in the Homestake mine kept finding only about a third of the solar neutrinos expected. The answer turned out to be flavor change."
- Sources: Nobel Prize in Physics 2002 (Davis, Koshiba); Bahcall (1989).
- Status: check.
- Used: L7.

### F-29 Muon and tau neutrinos
- Player wording: "The muon neutrino was found in 1962 and the tau neutrino in 2000."
- Sources: Nobel Prize in Physics 1988 (Lederman, Schwartz, Steinberger); DONUT Collaboration, *Phys. Lett. B* 504, 218 (2001).
- Status: check.
- Used: L7.

---

## Through-line counter

### F-32 Neutrinos through the player since pressing start
- Player wording: "Neutrinos through you since you started: about N trillion."
- Precise: N(t) = Φ × A × t, where Φ is the total solar neutrino flux at Earth (F-07, ≈ 6 × 10¹⁰ cm⁻² s⁻¹), A is an assumed cross-sectional area of an adult body as seen from the Sun, and t is seconds since start. Displayed to two significant figures with the word "about". The flux is the same day or night; at night the neutrinos arrive through the Earth (F-25).
- Assumption to source: A. Candidates: published adult frontal silhouette area from ergonomics or radiation-dosimetry literature. Until sourced, the counter must not ship.
- Sources: F-07 for Φ; A pending.
- Status: check (A needs a citation; Φ inherits F-07's status).
- Used: HUD from L2 onward, L6 finale.

## Formulas used in code

### F-30 Light travel time
- t = d / c, with c = 299,792.458 km/s. Used for the travel meter in L4 and the 2-second escape in L3.

### F-31 Cherenkov angle
- cos θ = 1 / (n β). For water n = 1.33, β → 1 gives θ ≈ 41.2°. Used to draw ring radius on the tank wall in L5.
- Sources: PDG "Passage of Particles Through Matter".
- Status: check.

---

## Image and asset credits

| ID | Asset | Credit | Rights | Status |
|---|---|---|---|---|
| A-01 | Super-K neutrino image of the Sun | R. Svoboda and K. Gordan (LSU), Super-Kamiokande Collaboration | unknown, must confirm before use | check |
| A-02 | Astro Bot screenshots | Sony Interactive Entertainment / Team Asobi | reference only, never shipped | n/a |

Everything else on screen is drawn procedurally by the app and needs no external credit.
