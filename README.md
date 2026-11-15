# Abhinav Raghavendra — portfolio

A dependency-free portfolio hosted on GitHub Pages: https://brocoder007.github.io/

## Preview and publish

Serve the repository root with any static server, for example `python -m http.server 4173 --bind 127.0.0.1`, and open http://127.0.0.1:4173. No package installation or build step is required. GitHub Pages publishes the root of `main`; merge a reviewed change to update the site.

## Content and visual design

- `index.html`: biography, projects, background, résumé and contact links. Project descriptions distinguish public previews from features that need a backend.
- `style.css`: responsive layouts, hover treatments, reveal transitions and static visual fallback.
- `script.js`: original Canvas 2D projection of a 3D wireframe torus, navigation, filters, progress ring, IST clock and motion controls.
- `assets/projects/`: screenshots from the actual Conflict Atlas, Jugaad and Rollcall interfaces. Rollcall’s screenshot uses synthetic data.
- `assets/Abhinav_Raghavendra_Resume.pdf`: the existing downloadable résumé, retained unchanged by this visual refresh.

The cinematic blue palette, luminous central object and restrained navigation are inspired by the Aether 1 reference supplied for this update. No Aether product imagery, code, audio or models are bundled. The mesh and monogram are original procedural artwork.

## Motion and accessibility

All portfolio content is static HTML and stays available without JavaScript. The menu uses native `details`; project rows and links remain visible without filters. Canvas has a CSS fallback and is decorative, not a source of information. The biography loads the existing GitHub avatar.

The scene caps device pixel ratio at 1.75 and rendering at 30 fps, and pauses when the hero is offscreen or the tab is hidden. The header’s Motion control pauses decorative animation, with an optional preference stored only in localStorage. Device reduced-motion preferences take priority and can change while the page is open. No autoplay audio, scroll interception, external analytics, runtime API calls or animation framework are used. The only external page asset is the existing GitHub avatar.

Validate meaningful changes through desktop/mobile browser review, keyboard navigation, motion pause and resume, category filtering, anchor navigation, résumé download and local asset checks. `node --check script.js` checks JavaScript syntax. There is no browser/backend build step.
