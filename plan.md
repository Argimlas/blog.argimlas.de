# Blog Project - Plan

## About this file
This is the living project document. It contains all architecture decisions,
feature definitions, design direction, and milestone status. Agents read this
for project context. Update it as the project evolves.

---

## Decisions & Deviations

Small choices made during implementation that aren't obvious from the spec.

- **Header scroll-hide (2026-06-05):** Plan said mobile-only. Changed to all screen sizes - user prefers the behavior on desktop too.
- **PostCard props (2026-09-23):** Card takes the whole collection entry (`post: CollectionEntry<"blog">`), not flattened fields - type stays generated from the schema, and `post.id` is available for the link.
- **Reading time (2026-09-23):** Computed from the post body, not a frontmatter field.
- **Feature image (2026-09-23):** Switch schema from `z.string()` to the `image()` helper for Astro image optimization; images live under `src/`, not `public/`.

---

## Stack

| | Decision |
|---|---|
| Framework | Astro (static site generation) |
| CSS | Tailwind CSS |
| Language | TypeScript |
| Blog posts | Markdown + MDX |
| Hosting | Manitu (own server, SSH access) |
| Deployment | GitHub Actions &rarr; rsync over SSH to Manitu |
| Version control | GitHub |
| Package Manager | Bun |
| OS/environment | Windows (primary) |

---

## Workflow

- Skills managed via `bunx skills` (cross-device); `/learn` skill loads `~/.learn-profile.md` for background and teaching style
- Planning and coding both happen in Zed with the Claude agent
- Push to main &rarr; GitHub Actions builds &rarr; rsync deploys to Manitu
- Writing a new post and pushing it publishes the updated site automatically

---

## Features

### Header (both pages)
- Logo left &rarr; links to landing
- Dark/light/system mode switch right
- Small nav bar right, with:
  - About
- Smart hide on scroll down, reappear on scroll up (all screen sizes)

### Footer (both pages)
- Contact
- Impressum &rarr; link to subdomain
- Datenschutzerklärung &rarr; link to subdomain

---

### Landing page

Layout top to bottom:
1. Header
2. Logo + short about text
3. Filter and sort controls
4. Post grid (3 columns, responsive)
5. Footer

#### Post grid cards (equal size)
- Feature image - if none, show longer description text instead
- Title
- Tags
- Reading time + date
- Series badge (if post belongs to a series)

#### Tag filtering
- Multi-select, OR logic
- Matched posts shown first in full 3-col grid
- Non-matching posts collapsed by tag below, collapsed by default
- Each collapsed section is a collapsible row with tag name + post count

#### Sorting
- By date - newest first / oldest first
- By reading time - shortest first / longest first

#### Search
- Text search across posts

---

### Blog post page

Layout:
1. Header (smart hide on mobile)
2. Feature image
3. Date, reading time, tags
4. Title
5. Description
6. Series navigator (only if post belongs to a series)
7. Markdown/MDX content - with ToC on the right
8. Footer

#### Table of contents
- Sticky, right side
- Highlights active section based on scroll position
- Expands one level: H2 visible always, H3s shown when parent H2 is active
- Hidden on mobile

#### Series navigator
- Shows all posts in the series
- Current post highlighted
- Links to all other parts
- Defined via frontmatter

---

### Series (frontmatter structure)
```
---
title: "Post title"
date: 2024-03-01
tags: ["tag1", "tag2"]
series: "Series Name"
seriesOrder: 1
description: "Short description"
featureImage: "./image.jpg"  # optional
---
```

---

### Other features
- RSS feed
- Dark / light / system color mode
- Fully responsive (mobile, tablet, desktop)
- No comments

---

## Design

### Colors
- Light mode: warm off-white background, near-black text, purple accent
- Dark mode: very dark desaturated purple background (not pure black), same purple accent slightly brightened
- One consistent accent purple used for: links, active tags, series badge, ToC highlight, hover states
- Chosen accent purple: `#4e229c` (light mode), `#6544c9` (dark mode, brightened); background `#d5cce0` (light) / `#1e1929` (dark)

### Typography
- Headings: custom font from friend when ready - fallback serif until then
- Body: serif web font, warm and readable (e.g. Lora or Literata)
- Both defined as CSS variables (`--font-heading`, `--font-body`) for easy swapping
- Custom font format needed: .woff2

### Personality details (to refine during styling)
- Off-white / off-black instead of pure values
- Distinctive code block and blockquote styling
- Small personal touch in footer

### Spacing
- Compact - more content visible, tighter padding

### Cards
- Equal size grid
- Corner radius: 4-8px

### Code blocks
- Syntax highlighting
- Adapts to light/dark mode

---

## Milestones

- [x] **1. Scaffold** - create Astro project, configure TypeScript + Tailwind + MDX, running locally
- [x] **2. Repo** - push to GitHub, set up repository structure
- [x] **3. Structure** - build core pages, routing, layouts, understand Astro fundamentals
- [ ] **4. Styling** - implement design system (colors, typography, dark mode, components)
  1. [x] **Design tokens** - `global.css`: color palette + font vars in Tailwind v4 `@theme`; light/dark schemes on `:root` and `[data-theme="dark"]`; pick accent purple
  2. [x] **Fonts** - load Lora (body) via Google Fonts `@import`; set `--font-body` and `--font-heading` (fallback serif); apply in `BaseLayout`
  3. [x] **Dark mode toggle** - `ThemeToggle.astro`: three states (light/dark/system); reads/writes `localStorage`; sets `data-theme` on `<html>`; inline script in `<head>` prevents flash
  4. [x] **Header** - logo left, nav + toggle right; scroll-hide on all screen sizes
  5. [x] **Footer** - links layout (contact, Impressum/Datenschutz to subdomain, GitHub/RSS); responsive stack on mobile
  6. **PostCard** - `PostCard.astro`: feature image or longer description, title, tags, reading time + date, series badge; equal-size grid card, 4-8px radius
     - [x] Card with linked title, rendered in `index.astro` list (props: whole `CollectionEntry<"blog">`)
     - [ ] Plain fields: description, date (formatted), tags, series badge (conditional)
     - [ ] Reading time: computed from `post.body`, in a helper shared with the post page
     - [ ] Feature image: schema `featureImage` -> `image()`, test image next to a test post, `<Image />` or description fallback
     - [ ] Layout: grid on the list in `index.astro`, card fills its cell
  7. **Landing page** - hero (logo + about text), 3-col responsive post grid; no filters/search yet (milestone 7)
  8. **Post page** - feature image, metadata (date/time/tags), title, description, content area; no ToC or series navigator yet (milestone 7)
  9. **Code blocks** - configure Shiki in `astro.config.mjs` with dual themes (light + dark) synced to `data-theme`
- [ ] **5. Content** - write one or two real posts, verify Markdown/MDX rendering, series + tags working
- [ ] **6. Deploy pipeline** - GitHub Actions + rsync over SSH to Manitu, test push-to-publish workflow
- [ ] **7. Polish** - RSS feed, responsive fixes, ToC, series navigator, search, performance

---

## Open items
- [ ] Confirm whether custom font from friend is available (need .woff2)
- [x] Choose specific accent purple hex during milestone 4 (Styling)
- [x] Create GitHub repo
- [ ] Create dedicated SSH user on Manitu for GitHub Actions (needed before milestone 6)
- [ ] Confirm Manitu document root path for rsync target
