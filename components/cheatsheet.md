# Beyond Summit — Component System Cheatsheet

## File Structure
```
/
├── index.html                  ← Homepage (already built)
├── trekking.html
├── expeditions.html
├── activities.html
│
├── pages/
│   ├── page-template.html      ← COPY THIS for every new page
│   ├── about.html
│   ├── contact.html
│   ├── blog.html
│   ├── guides.html
│   └── safety.html
│
├── treks/
│   ├── everest-base-camp-trek.html
│   ├── annapurna-base-camp-trek.html
│   └── ... (one file per trek)
│
├── expeditions/
│   └── ... (one file per expedition)
│
├── components/                 ← SHARED HTML FRAGMENTS
│   ├── nav.html                ← navigation + mobile drawer + WhatsApp
│   ├── footer.html             ← footer
│   └── contact-strip.html      ← phone/email/location bar
│
├── css/
│   ├── design-system.css       ← ALL shared variables, utilities, cards
│   └── nav.css                 ← nav + footer specific CSS
│
└── js/
    └── main.js                 ← ALL shared behaviour (BSE loader + init)
```

---

## Starting a New Page — 3 Steps

**1. Copy the template**
```bash
cp pages/page-template.html pages/about.html
```

**2. Edit the `<head>` block**
- Change `<title>`
- Change `<meta name="description">`
- Change `<link rel="canonical">`
- Change OG tags

**3. Write your page content** between `<main>` and the placeholders

That's it. Nav, footer, contact strip load automatically.

---

## Available CSS Classes

### Layout
```html
<div class="container">          <!-- max-width 1280px, auto margins -->
<section class="section">        <!-- standard vertical padding -->
<section class="section alt-bg"> <!-- warm white bg -->
<section class="section dark-bg"><!-- dark ink bg, light text -->
```

### Typography
```html
<span class="eyebrow">Label</span>
<h2 class="section-title">Title <em>in amber</em></h2>
<p class="section-lead">Subtext...</p>
```

### Buttons
```html
<a href="#" class="btn btn-amber">Primary CTA →</a>
<a href="#" class="btn btn-outline">Secondary</a>
<a href="#" class="btn btn-outline-light">On dark bg</a>
<a href="#" class="btn btn-ghost-light">Subtle on dark</a>
```

### Trek / Expedition Card
```html
<a href="/treks/example.html" class="trek-card">         <!-- normal -->
<a href="/treks/example.html" class="trek-card featured"> <!-- wider -->
  <div class="trek-card-img">
    <img src="..." alt="...">
    <div class="trek-card-img-overlay"></div>
    <span class="card-badge">Label</span>
    <span class="card-alt">5,364 m</span>
  </div>
  <div class="trek-card-body">
    <div class="card-number">01 · Region</div>
    <h3 class="card-name">Trek Name</h3>
    <p class="card-desc">Description...</p>
    <div class="card-specs">
      <div><div class="spec-val">14</div><div class="spec-key">Days</div></div>
      <div><div class="spec-val">5,364m</div><div class="spec-key">Max Alt.</div></div>
      <div><div class="spec-val">From $1,650</div><div class="spec-key">Per Person</div></div>
    </div>
    <span class="card-link">View Trek <svg ...></svg></span>
  </div>
</a>
```

### Activity Card (portrait)
```html
<a href="#" class="act-card">
  <img src="..." alt="...">
  <div class="act-overlay"></div>
  <div class="act-body">
    <div class="act-tag">Category · Location</div>
    <div class="act-name">Activity Name</div>
    <div class="act-meta">Short description</div>
    <div class="act-link">Learn more ›</div>
  </div>
</a>
```

### Horizontal Scroll Rail
```html
<div class="container" style="padding-right:0;">
  <div class="scroll-container">
    <div class="scroll-rail" id="myRail">
      <!-- cards here -->
    </div>
  </div>
  <div class="scroll-nav">
    <button class="scroll-nav-btn" onclick="scrollRail('myRail',-1)">←</button>
    <button class="scroll-nav-btn" onclick="scrollRail('myRail', 1)">→</button>
  </div>
</div>
```

### Testimonial Card
```html
<div class="testi-card">                   <!-- normal -->
<div class="testi-card featured">          <!-- dark featured -->
  <div class="tquote-mark">"</div>
  <p class="tquote">Review text...</p>
  <div style="display:flex;gap:2px;">
    <span class="tstar">★</span>×5
  </div>
  <div class="tcard-divider"></div>
  <div class="tauthor">
    <div class="tavatar">A</div>
    <div>
      <div class="tname">Person Name</div>
      <div class="tmeta">Role · Location</div>
    </div>
    <div class="tpeak">Trek 2025</div>
  </div>
</div>
```

### Reveal Animation
Add `.reveal` to any element. It fades+slides in when scrolled into view.
```html
<div class="reveal">               <!-- animates in -->
<div class="reveal reveal-delay-1"><!-- 0.1s delay -->
<div class="reveal reveal-delay-2"><!-- 0.2s delay -->
<div class="reveal reveal-delay-3"><!-- 0.35s delay -->
```

### Inner Page Hero (non-homepage)
```html
<section class="page-hero">
  <div class="container">
    <span class="eyebrow page-hero-kicker">Section · Sub</span>
    <h1 class="section-title reveal">Title <em>Here</em></h1>
    <p class="section-lead reveal reveal-delay-1">Description.</p>
  </div>
</section>
```

### Quote Banner
```html
<div class="quote-banner">
  <img class="quote-bg" src="/assets/images/your-image.jpg" alt="...">
  <div class="quote-overlay"></div>
  <div class="quote-content">
    <span class="qmark" aria-hidden="true">"</span>
    <blockquote class="qtext reveal">Your quote <em>here</em>.</blockquote>
    <p class="qattr reveal reveal-delay-1">Attribution · Context</p>
  </div>
</div>
```

---

## Adjusting Paths for Subdirectories

If your page is at `/treks/everest-base-camp-trek.html`, the component URLs need to be relative to root:

```js
BSE.loadAll([
  { selector: '#nav-placeholder',           url: '/components/nav.html' },
  { selector: '#contact-strip-placeholder', url: '/components/contact-strip.html' },
  { selector: '#footer-placeholder',        url: '/components/footer.html' },
]);
```

The `/` prefix means "from the website root" — this works as long as you're serving from a web server (not opening files directly). For local dev use VS Code Live Server or `npx serve .`

---

## Local Development

```bash
# Option 1: VS Code Live Server extension (recommended)
# Right-click index.html → Open with Live Server

# Option 2: npx
npx serve .

# Option 3: Python
python3 -m http.server 8000
```

> ⚠️  The `fetch()` component loader won't work when opening HTML files directly from your desktop (file:// protocol). Always use a local server.