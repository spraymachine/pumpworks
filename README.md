# Pumpworks — Diesel Service

Marketing site for a diesel fuel injection pump workshop. The design follows the
`liquid-title.html` prototype recorded in `IMG_8190.MOV`: the hero is a test bench,
and holding the bar primes the pump while the title fills with fuel.

```
index.html
assets/css/site.css
assets/js/site.js
```

No build step. Open `index.html` directly, or serve the folder:

```bash
npx http-server . -p 4321 -c-1
```

## Before this goes live

Replace the placeholders — they are invented, not real:

| What | Where |
|---|---|
| Phone `+971 4 000 0000` | `index.html` (nav CTA, book section, footer) and the `book.call` key in `site.js` |
| Email `bench@pumpworks.ae` | `index.html` book section and footer |
| Address, hours, "since 1994" | `index.html` footer |
| Bench specs, pump list, warranty, turnaround | `#specs` and `#support` in `index.html` |

The spec figures are plausible for a diesel injection bench but are **not** this
shop's actual equipment. Confirm every number before publishing — they are the
most credible thing on the page and the easiest to get wrong.

## Arabic (v2)

The `عربي` toggle already works: it flips `lang`/`dir`, swaps the copy, and
remembers the choice in `localStorage`. The layout is built on CSS logical
properties, so RTL mirrors without a second stylesheet.

**The Arabic copy in `site.js` (the `AR` and `DYN.ar` objects) has not been
reviewed by a native speaker.** Treat it as groundwork, not finished text. The
hero lockup in particular (`hero.line1` / `hero.line2`) is a display headline and
deserves a copywriter rather than a translator.

Arabic sets narrower than the English lockup, so the hero is scaled by
`--rig-scale: 1.32` under `html[lang="ar"]`. If you change the Arabic headline,
re-check that it still fits — the title is `white-space: nowrap` by design.

## How the hero works

`site.js` runs a small physics loop. `level` (0–1) eases toward 1 while held and
drains faster on release; pressure and RPM are derived from it, with slight
jitter so the gauges read like live needles rather than a progress bar.

The liquid surface is a `clip-path: polygon()` recomputed each frame — a sine
along the top edge, with the amplitude spiking on release so it sloshes. Because
the clip is applied to a text element using `background-clip: text`, the fill is
masked to the letterforms at any size.

Under `prefers-reduced-motion` the fill still works (it is user-initiated) but
the surface goes flat and the scroll reveals are disabled.

## The feature figures

Each plate in "What comes off the bench" carries an inline SVG schematic of its
own subject, on a continuous loop: the gauge sweeps through a bench run, the
delivery bars drift off target and get trimmed back level, the assembly draws
together and separates, the nozzle fires injection pulses.

Three things keep them cheap and safe to change:

- All four loops animate `transform` and `opacity` only, so they stay off the
  layout path.
- They are `animation-play-state: paused` until the plate reveals, so nothing
  runs off screen. That pause is gated on `.js` — with scripting off they simply
  run.
- The animations live inside `@media (prefers-reduced-motion: no-preference)`.
  The base CSS holds the *resolved* pose (needle at reading, bars level, parts
  assembled, spray full), so a reduced-motion visitor gets a correct finished
  drawing rather than a frozen mid-frame. If you add a figure, keep that split.

## Accessibility notes

- `HOLD TO PRIME` responds to pointer, touch, and a held Space/Enter.
- `--steel` is `#6B625B`, which is 5.47:1 on paper and 5.09:1 on the alternate
  band. Do not lighten it back toward the mockup's grey — that measured 4.25:1
  and fails WCAG AA.
- Scroll-reveal elements are hidden only when the `js` class is present, so the
  page is never blank if JavaScript fails. There is also a 1.6s failsafe in case
  the IntersectionObserver never reports.
