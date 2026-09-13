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
- Precise: ppIII branch: ⁷Be + p → ⁸B + γ; ⁸B → ⁸Be* + e⁺ + νₑ. ⁸B neutrinos have a continuous spectrum with an endpoint near 15–16 MeV. pp neutrinos have a maximum energy of 0.42 MeV, below Super-Kamiokande's analysis threshold (F-23).
- Sources: Bahcall (1989); Super-Kamiokande Collaboration, "Solar neutrino measurements in Super-Kamiokande-IV", *Phys. Rev. D* 94, 052010 (2016), arXiv:1606.07538; endpoints as quoted in Super-Kamiokande Collaboration, "Solar neutrino measurements in Super-Kamiokande-I", arXiv:hep-ex/0508053.
- Status: verified (endpoints); say "up to about 15 MeV" on screen.
- Used: L1, L2, L5.

### F-03 Core temperature
- Player wording: "The Sun's core is about 15 million degrees."
- Precise: central temperature 1.571 × 10⁷ K.
- Sources: NASA NSSDCA Sun Fact Sheet (D. R. Williams), https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
- Status: verified.
- Used: L2.

### F-04 How light neutrinos are
- Player wording: "It has mass, but so little that the best lab measurement can only say it is less than 0.45 electronvolts. That is over a million times lighter than an electron."
- Precise: KATRIN 90% CL upper limit on the effective electron antineutrino mass: m < 0.45 eV (259 days of data). Electron mass energy equivalent 0.510 998 950 69 MeV (CODATA 2022); ratio > 1.1 × 10⁶.
- Sources: KATRIN Collaboration, "Direct neutrino-mass measurement based on 259 days of KATRIN data", *Science* 388, 180 (2025), https://www.science.org/doi/10.1126/science.adq9592 ; electron mass: NIST CODATA 2022, https://physics.nist.gov/cgi-bin/cuu/Value?mec2mev
- Status: verified.
- Used: L2.

### F-05 Neutrinos do have mass
- Player wording: "We know it isn't weightless, because a weightless neutrino could never change flavor."
- Precise: neutrino oscillation requires non-zero mass-squared differences. Planning values: Δm²₂₁ ≈ 7.5 × 10⁻⁵ eV², |Δm²₃₂| ≈ 2.4 × 10⁻³ eV², so at least one mass state is ≳ 0.05 eV. The on-screen line makes only the qualitative claim.
- Sources: PDG 2024 review "Neutrino Masses, Mixing, and Oscillations", https://pdg.lbl.gov/2024/reviews/rpp2024-rev-neutrino-mixing.pdf (PDF could not be parsed this session; values above are from secondary quotes of it and must be read off the review directly).
- Status: verified (qualitative claim, via F-13 Nobel motivation "which shows that neutrinos have mass"); check (numeric Δm² values, not shown on screen).
- Used: L3.

### F-06 No electric charge
- Player wording: "It has no electric charge, so electric and magnetic forces ignore it."
- Precise: neutrinos are electrically neutral leptons interacting only via the weak force (and gravity).
- Sources: PDG.
- Status: check.
- Used: L2.

### F-07 How many pass through you
- Player wording: "Tens of billions of solar neutrinos pass through every square centimeter of you every second."
- Precise: total solar neutrino flux at Earth ≈ 6 × 10¹⁰ cm⁻² s⁻¹, dominated by pp neutrinos (≈ 6.0 × 10¹⁰ cm⁻² s⁻¹ in standard solar models). ⁸B flux ≈ 5 × 10⁶ cm⁻² s⁻¹. Planning values to confirm from Table 1 of BS05: pp 5.99 × 10¹⁰, ⁸B 5.69 × 10⁶ cm⁻² s⁻¹ (BS05(OP)).
- Sources: Bahcall, J. N., Serenelli, A. M., Basu, S., "New solar opacities, abundances, helioseismology, and neutrino fluxes", *Astrophys. J.* 621, L85 (2005), arXiv:astro-ph/0412440, Table 1; SNO Collaboration total ⁸B flux, *Phys. Rev. C* 88, 025501 (2013).
- Status: check (read Table 1 directly; the PDF could not be parsed this session). The rounded on-screen wording is safe under any standard solar model.
- Used: L2.

### F-08 How long light takes to escape the Sun
- Player wording: "Light made in the core takes tens of thousands of years or more to reach the surface, because it keeps bumping into matter."
- Precise: radiative diffusion time from core to surface. Mitalas & Sills compute about 170,000 years with a random walk and a solar-model step length of 0.090 cm, and note that the commonly assumed 0.5–1 cm step gives an answer an order of magnitude too short (about 10⁴ years). We deliberately say "tens of thousands of years or more", which is true under either estimate.
- Sources: Mitalas, R. & Sills, K. R., "On the photon diffusion time scale for the Sun", *Astrophys. J.* 401, 759 (1992), https://ui.adsabs.harvard.edu/abs/1992ApJ...401..759M/abstract
- Status: verified.
- Used: L3.

### F-09 How long a neutrino takes
- Player wording: "A neutrino crosses the whole Sun in about 2 seconds."
- Precise: volumetric mean solar radius 695,700 km / c = 2.32 s.
- Sources: solar radius, NASA NSSDCA Sun Fact Sheet (F-03 link); formula F-30.
- Status: verified.
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
- Precise: Nobel motivation: "for the discovery of neutrino oscillations, which shows that neutrinos have mass". Super-K reported evidence in 1998 (*Phys. Rev. Lett.* 81, 1562); SNO reported the all-flavor solar flux in 2001–2002 (*Phys. Rev. Lett.* 89, 011301).
- Sources: Nobel Prize in Physics 2015 press release, https://www.nobelprize.org/prizes/physics/2015/press-release/ ; popular information, https://www.nobelprize.org/prizes/physics/2015/popular-information/
- Status: verified (motivation, names, years); check (the two journal references, which are not shown on screen).
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
- Sources: CERN, "The Standard Model", https://home.cern/science/physics/standard-model/
- Status: verified.
- Used: L4. The 17 tile labels are in `BEATS.md` under level 4.

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
- Precise: Cherenkov radiation, cos θ = 1/(nβ); for water n = 1.33 and β → 1, θ = 41.2°; Super-Kamiokande papers quote "about 42°".
- Sources: Super-Kamiokande official detector page (F-17 link); Super-Kamiokande Collaboration atmospheric neutrino papers, e.g. arXiv:hep-ex/9810001; PDG review "Passage of Particles Through Matter".
- Status: verified.
- Used: L5. Formula F-31.

### F-22 Electron rings are fuzzy, muon rings are sharp
- Player wording: "An electron scatters and showers, so its ring is fuzzy. A muon punches straight through, so its ring is sharp. Physicists sort events this way, and some are hard to call."
- Precise: e-like vs μ-like particle identification from ring edge sharpness; misidentification is non-zero, especially at lower energies.
- Sources: T2K, "Super-Kamiokande event displays", https://t2k-experiment.org/super-kamiokande-event-displays/ ; Super-Kamiokande Collaboration (Y. Ashie et al.), "Measurement of atmospheric neutrino oscillation parameters by Super-Kamiokande I", *Phys. Rev. D* 71, 112005 (2005), arXiv:hep-ex/0501064 (particle identification section).
- Status: verified (fuzzy/sharp description, T2K page); check (read the Ashie PID section to confirm the misidentification wording; PDF could not be parsed this session).
- Used: L5.

### F-23 Solar neutrinos in Super-K
- Player wording: "Solar neutrinos show up as electron rings pointing away from the Sun."
- Precise: detected via elastic scattering ν + e⁻ → ν + e⁻; recoil electron direction correlates with the Sun's direction; analysis threshold 3.49 MeV recoil kinetic energy (SK-IV), with newer work reaching down to 2.99 MeV.
- Sources: arXiv:1606.07538; arXiv:2512.19887.
- Status: verified.
- Used: L5.

### F-24 Public Super-K solar data
- What exists: an official public dataset of the ⁸B solar neutrino flux in 5-day bins, 5,804 live days from 31 May 1996 to 30 May 2018 (SK-I to SK-IV), about 1,100 rows, 10 columns: mean time (Unix seconds), offsets to bin start and end, flux and its upper/lower errors (10⁶ cm⁻² s⁻¹), Sun–Earth distance squared (au²), and distance-corrected flux with errors. Also a full SK-IV solar data release. Raw per-event data are not public; the site states event-level data need proprietary software.
- Sources: Super-Kamiokande public data page, https://www-sk.icrr.u-tokyo.ac.jp/en/sk/for-reseacher/ ; 5-day file, https://www-sk.icrr.u-tokyo.ac.jp/sk/publications/data/sksolartimevariation5804d.txt ; companion paper, Super-Kamiokande Collaboration, "Search for Periodic Time Variations of the Solar ⁸B Neutrino Flux between 1996 and 2018 in Super-Kamiokande", *Phys. Rev. Lett.* 132, 241803 (2024), arXiv:2311.01159; full SK-IV solar release, https://www-sk.icrr.u-tokyo.ac.jp/sk/publications/data/sksolarfull.zip with *Phys. Rev. D* 109, 092001 (2024).
- What the flux column means: Super-K measures a handful of neutrino-electron scatters per day and reports them as an equivalent ⁸B flux at Earth. Because the detector is mostly sensitive to electron flavor, and only about a third of ⁸B neutrinos arrive as electron flavor (F-14), the reported number (about 2.3 × 10⁶ cm⁻² s⁻¹) is well below the total ⁸B flux (F-07). The chart must not label this as "neutrinos reaching Earth"; label it as Super-K's measurement.
- Licence: none stated on the page. Cite the collaboration and the companion paper.
- Status: verified (file and columns); check (confirm the column definition against the file header and the PRL paper before writing the axis label).
- Used: L5 honesty note, L6, credits.

---

## The Sun in neutrinos

### F-25 The neutrino picture of the Sun
- Player wording: "This is the Sun, seen in neutrinos. It took 503 days of watching. Some of these neutrinos arrived at night, after passing through the entire Earth."
- Precise: Super-Kamiokande solar neutrino sky map, 503 days exposure, 90° × 90° field centered on the Sun.
- Sources: NASA APOD 1998 June 5, https://science.nasa.gov/image-article/apod-1998-june-05-neutrinos-in-the-sun/ ; HEASARC, https://heasarc.gsfc.nasa.gov/docs/objects/heapow/archive/solar_system/superk_sun.html
- Image credit: R. Svoboda and K. Gordan (Louisiana State University), Super-Kamiokande Collaboration.
- Rights: the Kamioka Observatory site states unauthorized reproduction of its materials is prohibited and educational use needs an application. No request is being made (D-028). The image is not shipped; the game only mentions in text that neutrinos arrive at night through the Earth.
- Status: verified (credit and exposure).
- Used: L6 text only, L7.

---

### F-33 The only pattern is Earth's orbit
- Player wording: "The only pattern in all those years is a gentle yearly wobble, because Earth's orbit is slightly oval."
- Precise: a search for periodic modulations in the 5,804-day, 5-day-binned ⁸B flux found the only significant modulation to be the annual one from the eccentricity of Earth's orbit (the 1/r² change in flux with Sun–Earth distance). The public file includes a distance-corrected flux column.
- Sources: Super-Kamiokande Collaboration, "Search for Periodic Time Variations of the Solar ⁸B Neutrino Flux between 1996 and 2018 in Super-Kamiokande", *Phys. Rev. Lett.* 132, 241803 (2024), arXiv:2311.01159 (abstract).
- Status: verified (abstract); check (read the paper for the amplitude before quoting any percentage; none is quoted on screen).
- Used: L6.

### F-34 Where solar neutrino events point
- Player wording: none; drives the level 6 sky map.
- Precise: Super-K detects solar neutrinos through elastic scattering on electrons, which throws the electron forward, so reconstructed event directions cluster around the Sun's direction above a flat background of other events; the electron's angle to the neutrino is limited by the kinematics and the reconstruction adds a smear of tens of degrees. The level 6 map draws simulated events from that shape: a fraction of events Gaussian about the Sun's position, the rest uniform over a 90° × 90° field. Planning values in code: 40% signal, 14° spread.
- Sources: as F-21 and F-23; the sky-map description in F-25's sources.
- Status: check (confirm the signal fraction and angular spread against the Super-K solar papers before quoting any number; none is quoted on screen).
- Used: L6.

## History (side panels)

### F-26 Prediction and naming
- Player wording: "In 1930 Wolfgang Pauli proposed an unseen particle to explain missing energy in radioactive decays. Enrico Fermi gave it the name neutrino, 'little neutral one'."
- Precise: Pauli's open letter dated 4 December 1930 to the Tübingen meeting, proposing a neutral particle he called the "neutron"; Chadwick's neutron (1932) took that name; Fermi's 1933–34 beta-decay theory used the name "neutrino".
- Sources: CERN timeline, https://timeline.web.cern.ch/december-1930-paulis-neutrino-letter-now-music-and-art ; CERN Scientific Information Service, https://library.cern/archives/history_CERN/historical_images/month-88-years-ago
- Status: verified.
- Used: L7.

### F-27 First detection
- Player wording: "It was first detected in 1956 by Clyde Cowan and Frederick Reines, using a nuclear reactor. Reines received the 1995 Nobel Prize."
- Precise: Reines and Cowan, "Detection of the Free Neutrino: a Confirmation", *Science* 124, 103 (20 June 1956), Savannah River reactor. Reines shared the 1995 Nobel Prize (the other half to Martin Perl for the tau lepton). Cowan died in 1974.
- Sources: Nobel Prize in Physics 1995 press release, https://www.nobelprize.org/prizes/physics/1995/press-release/ ; APS Physics Focus Landmarks, https://physics.aps.org/story/v19/st13
- Status: verified.
- Used: L7.

### F-28 The solar neutrino problem
- Player wording: "From the late 1960s, Ray Davis's experiment in the Homestake mine kept finding only about a third of the solar neutrinos expected. The answer turned out to be flavor change."
- Precise: Davis's chlorine detector (615 tonnes of tetrachloroethylene) ran in the Homestake mine from 1967; over decades it found about one third of the predicted rate. Davis and Koshiba shared half of the 2002 Nobel Prize "for pioneering contributions to astrophysics, in particular for the detection of cosmic neutrinos".
- Sources: Nobel Prize in Physics 2002 popular information, https://www.nobelprize.org/prizes/physics/2002/popular-information/ ; CERN Courier, https://cerncourier.com/a/2002-nobel-prize-for-physics-is-announced/
- Status: verified.
- Used: L7.

### F-29 Muon and tau neutrinos
- Player wording: "The muon neutrino was found in 1962 and the tau neutrino in 2000."
- Precise: muon neutrino, Brookhaven 1962 (Nobel Prize 1988, Lederman, Schwartz, Steinberger). Tau neutrino: DONUT at Fermilab, announced 20 July 2000, four events, published as "Observation of tau neutrino interactions", *Phys. Lett. B* 504, 218 (2001).
- Sources: Nobel Prize in Physics 1988, https://www.nobelprize.org/prizes/physics/1988/summary/ ; DONUT paper record, https://inspirehep.net/literature/538648
- Status: verified (DONUT); check (1988 Nobel page).
- Used: L7.

---

## Through-line counter

### F-32 Neutrinos through the player since pressing start
- Player wording: "Neutrinos through you since you started: about N trillion."
- Precise: N(t) = Φ × A × t, where Φ is the total solar neutrino flux at Earth (F-07, ≈ 6 × 10¹⁰ cm⁻² s⁻¹), A is the body's cross-sectional area as seen from the Sun, and t is seconds since start. Displayed to three significant figures with a word scale (trillion, quadrillion, quintillion) and the word "about", updated ten times a second. The flux is the same day or night; at night the neutrinos arrive through the Earth (F-25).
- Reference person (decided): 150 lb (68 kg), 5 ft 7 in (170 cm), standing and facing the Sun.
- A is built from two sourced pieces:
  1. Skin surface area by the DuBois formula, BSA = 0.007184 × W^0.425 × H^0.725 with W in kg and H in cm: 0.007184 × 68^0.425 × 170^0.725 = 1.79 m².
  2. The fraction of that area presented toward a source at the horizon, the projected area factor f_p for a standing adult. Planning value 0.3 (Fanger's standing-person curves give roughly 0.3–0.35 at azimuth 0°, altitude 0°). A = f_p × BSA ≈ 0.3 × 1.79 m² ≈ 0.54 m² = 5,400 cm².
- Planning rate: 6 × 10¹⁰ × 5,400 ≈ 3.2 × 10¹⁴ per second, i.e. "about 320 trillion per second". Ten minutes of play ≈ 1.9 × 10¹⁷.
- Credits disclosure: "Assumes an adult of 150 lb and 5 ft 7 in standing and facing the Sun. Turn sideways and the number drops; it is a rough figure."
- Fallback if f_p cannot be pinned: count per square centimetre instead ("through each square centimetre of you"), which needs only F-07.
- Sources: F-07 for Φ; DuBois, D. & DuBois, E. F., "A formula to estimate the approximate surface area if height and weight be known", *Arch. Intern. Med.* 17, 863 (1916); Fanger, P. O., *Thermal Comfort: Analysis and Applications in Environmental Engineering* (Danish Technical Press, 1970), projected area factor curves; Kubaha, K., Fiala, D., Toftum, J., Taki, A., "Human projected area factors for detailed direct and diffuse solar radiation analysis", *Int. J. Biometeorol.* 49, 113 (2004).
- Status: verified (DuBois formula and arithmetic); check (read the f_p value off Fanger 1970 or Kubaha 2004 directly; neither could be opened this session).
- Used: HUD from L2 onward, L6 finale.

## Formulas used in code

### F-30 Light travel time
- t = d / c, with c = 299,792.458 km/s. Used for the travel meter in L4 and the 2-second escape in L3.

### F-31 Cherenkov angle
- cos θ = 1 / (n β). For water n = 1.33, β → 1 gives θ = 41.2°. Used to draw ring radius on the tank wall in L5.
- Sources: as F-21.
- Status: verified.

---

## Image and asset credits

| ID | Asset | Credit | Rights | Status |
|---|---|---|---|---|
| A-01 | Super-K neutrino image of the Sun | R. Svoboda and K. Gordan (LSU), Super-Kamiokande Collaboration | not shipped (D-028); mentioned in text only | n/a |
| A-02 | Super-K 5-day solar flux dataset, plotted in level 6 | Super-Kamiokande Collaboration, *Phys. Rev. Lett.* 132, 241803 (2024); file `sksolartimevariation5804d.txt` | public download, no licence stated; cite the collaboration and paper in credits | verified |
| A-04 | Manrope typeface, all on-screen text | The Manrope Project Authors, https://github.com/sharanda/manrope | SIL Open Font License 1.1; licence text shipped at `public/fonts/OFL.txt` | verified |
| A-03 | Astro Bot screenshots | Sony Interactive Entertainment / Team Asobi | reference only, never shipped | n/a |

Everything else on screen is drawn procedurally by the app and needs no external credit.
