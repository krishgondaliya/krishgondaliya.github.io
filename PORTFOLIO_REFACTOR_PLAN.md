# Portfolio Refactor Plan

## 1. Current Codebase Overview

### Framework Used

This repo is currently a small static HTML/CSS/JavaScript site. There is no build framework, package manager, bundler, templating system, or component runtime.

Current runtime model:

- Static HTML pages served directly by any static server.
- Shared stylesheet at `css/live.css`.
- Shared theme script at `scripts/theme-toggle.js`.
- Local image assets under `static/images/`.

### Main Folders and Files

- `index.html`
  - Current homepage.
  - Shows the shared header, tagline, a featured writing/post list, and footer.

- `about/index.html`
  - Current About page.
  - Contains avatar, short bio, and quote.

- `blog/index.html`
  - Current Blog page.
  - Contains a side tag list and a full post list.

- `tags/index.html`
  - Current Tags page.
  - Contains a tag cloud linking back to Blog.

- `snippets/index.html`
  - Current Snippets page.
  - Contains two snippet cards.

- `css/live.css`
  - All visual styling.
  - Defines light/dark palette, header, nav, post cards, tag cloud, snippets, about layout, footer, and responsive behavior.

- `scripts/theme-toggle.js`
  - Handles light/dark mode.
  - Reads and writes `localStorage.theme`.
  - Applies `.dark` to the root `<html>` element.

- `static/images/archer-banner.jpeg`
  - Current hero/header background image.

- `static/images/usagi-avatar.png`
  - Current avatar image.

### Existing Sections and Components

The site has these reusable patterns:

- Shared header:
  - `.site-header`
  - `.shell`
  - `.header-inner`
  - `.brand`
  - `.nav`
  - `.theme-toggle`

- Shared page shell:
  - `.page`
  - `main`
  - `.footer`

- List/card patterns:
  - `.post-list`
  - `.post-link`
  - `.tags`
  - `.summary`
  - `.snippet-grid`
  - `.snippet-card`
  - `.tag-cloud`
  - `.tag-pill`

- About layout:
  - `.about-layout`
  - `.avatar`
  - `.about-copy`

These patterns are worth preserving and gradually renaming only when a new section needs more specific semantics.

### Current Navigation Structure

Current nav appears in every HTML page and is hardcoded separately in each file:

- `Blog` -> `/blog/`
- `Tags` -> `/tags/`
- `Snippets` -> `/snippets/`
- `About` -> `/about/`
- Theme toggle button

The current nav does not match the target portfolio structure. It should eventually become:

- `About`
- `Projects`
- `Research`
- `Books / Notes`
- `Writing`

### Where Personal Content Is Hardcoded

Personal/site identity is hardcoded in multiple places:

- `Secret Base`
  - Page titles.
  - Brand link text.
  - Footer.
  - Open Graph metadata on `index.html`.

- `Jac Hsu`
  - Footer.
  - About page title/description.
  - About page bio.

- Current content lists:
  - Homepage featured posts in `index.html`.
  - Full blog posts and tags in `blog/index.html`.
  - Tag counts in `tags/index.html`.
  - Snippet cards in `snippets/index.html`.

- Current images:
  - Header background in `css/live.css`.
  - Avatar in `about/index.html`.
  - Metadata image in `index.html`.

This hardcoding is manageable for a static site, but it will become tedious as portfolio sections grow. The refactor should move personal content into small data/config files before adding many entries.

## 2. Target Portfolio Structure

### Proposed Final Sections

1. `About`
   - Short intro.
   - Current role/interests.
   - Quant development and systems engineering focus.
   - Technical stack.
   - Contact links.
   - Optional resume/CV link.

2. `Projects`
   - Selected engineering projects.
   - Quant/dev tooling projects.
   - Backtesting, market simulation, data infrastructure, low-latency/system tools, visualization, or research tooling.
   - Each project should include title, summary, tags, status, links, and a short technical note.

3. `Research`
   - Reading/research interests.
   - Papers, experiments, notes, or replicated results.
   - Topics might include market microstructure, statistical arbitrage, optimization, systems performance, distributed systems, or ML for time series.

4. `Books / Notes`
   - Book notes, technical notes, and distilled learning.
   - Can reuse the current snippet-card style.
   - Should support short summaries and tags.

5. `Writing / Substack`
   - External writing links.
   - Substack posts or long-form essays.
   - Existing Blog list styles can be reused here.

### What Each Section Should Contain

- About:
  - Hero/introduction text.
  - Avatar or professional image.
  - Interest bullets.
  - Links to GitHub, LinkedIn, email, resume, Substack.

- Projects:
  - Grid or list of project cards.
  - Each item: name, one-line summary, longer description, stack, tags, links.
  - Optional featured projects on homepage.

- Research:
  - List of papers/experiments.
  - Each item: title, topic, summary, date, status, link or local note.
  - Optional categories by topic.

- Books / Notes:
  - Card grid similar to current Snippets.
  - Each item: title, author/source, short summary, tags, link.

- Writing / Substack:
  - List layout similar to current Blog.
  - External links should clearly indicate they leave the site.
  - Optional RSS/Substack subscription link.

### Existing Components That Can Be Reused

- Shared header and footer.
- Theme toggle.
- `.shell`, `.page`, `.page-title`, and responsive layout rules.
- `.post-list` and `.post-link` for Writing/Substack and Research list views.
- `.snippet-grid` and `.snippet-card` for Projects and Books/Notes cards.
- `.tags`, `.summary`, `.tag-pill` for metadata.
- Current warm light/dark palette.

### Components to Remove or Rename Later

- Rename `blog/` to `writing/` or keep `/blog/` as a redirect-style compatibility page later.
- Rename `snippets/` to `notes/` or fold into `books-notes/`.
- Remove `tags/` if tag browsing is not useful in the first portfolio version.
- Replace `Secret Base` brand with your name or a chosen personal site title.
- Replace `Jac Hsu` and current bio content.
- Replace current banner/avatar assets if they do not fit your own identity.

## 3. Step-by-Step Refactor Roadmap

### Phase 1: Inventory and Cleanup

Goal: prepare for small, safe refactors without changing visible behavior much.

Steps:

1. Add a `README.md` describing how to run the static site locally.
2. Add a simple `data/` directory with draft config files, but do not wire them in yet.
3. Decide final URL names:
   - `/about/`
   - `/projects/`
   - `/research/`
   - `/notes/`
   - `/writing/`
4. Identify any remaining source text/images that still refer to the old identity.
5. Commit this phase by itself.

### Phase 2: Navigation and Layout Changes

Goal: change top-level structure while preserving shared styling.

Steps:

1. Update repeated header nav in each page to target:
   - About
   - Projects
   - Research
   - Books / Notes
   - Writing
2. Keep the theme toggle unchanged.
3. Add placeholder pages for missing sections:
   - `projects/index.html`
   - `research/index.html`
   - `notes/index.html`
   - `writing/index.html`
4. Keep content minimal and clearly placeholder-like.
5. Commit nav/layout changes separately.

### Phase 3: About Section

Goal: make the About page yours first, because it defines the site identity.

Steps:

1. Replace `Jac Hsu` and placeholder bio with your name and target positioning.
2. Add sections for:
   - Quant development interests.
   - Systems engineering interests.
   - Current tools/languages.
   - Contact links.
3. Replace avatar if desired.
4. Update homepage metadata and footer identity.
5. Commit About changes separately.

### Phase 4: Projects Section

Goal: build a reusable project-card pattern without overengineering.

Steps:

1. Create `projects/index.html`.
2. Reuse `.snippet-grid` and `.snippet-card` initially.
3. Add 3-5 project placeholders or real projects.
4. Extend CSS only if project cards need fields like status, stack, or links.
5. Later, move project entries into `data/projects.json`.
6. Commit Projects separately.

### Phase 5: Research Section

Goal: create a research index that can grow slowly.

Steps:

1. Create `research/index.html`.
2. Reuse `.post-list` and `.post-link`.
3. Add categories such as:
   - Market microstructure.
   - Backtesting and simulation.
   - Statistical learning.
   - Systems performance.
4. Use placeholder entries first if needed.
5. Later, move research entries into `data/research.json`.
6. Commit Research separately.

### Phase 6: Books / Notes Section

Goal: convert Snippets into your own notes library.

Steps:

1. Rename or replace `snippets/` with `notes/`.
2. Reuse `.snippet-grid` and `.snippet-card`.
3. Add notes grouped by books, papers, and technical topics.
4. Keep each card short: title, source/author, summary, tags.
5. Later, move entries into `data/notes.json`.
6. Commit Notes separately.

### Phase 7: Writing / Substack Section

Goal: replace Blog with a writing index that can link externally.

Steps:

1. Create or rename to `writing/index.html`.
2. Reuse `.post-list` and `.post-link`.
3. Add Substack links and any local essays.
4. Add an external-link treatment if useful.
5. Later, move entries into `data/writing.json`.
6. Commit Writing separately.

### Phase 8: Polish, Responsiveness, and Final Cleanup

Goal: refine the site after content and structure are stable.

Steps:

1. Review mobile layout for all sections.
2. Ensure button text and card text do not overflow.
3. Tune the warm light/dark palette after real content is present.
4. Replace banner image with a personal or abstract technical image if desired.
5. Add favicon and social preview image.
6. Remove old routes no longer linked.
7. Add a final accessibility pass:
   - meaningful page titles.
   - good alt text.
   - visible focus states.
   - correct heading order.
8. Commit polish separately.

## 4. File-by-File Change Plan

### `index.html`

- Current purpose:
  - Homepage with brand, nav, tagline, featured post list, and footer.
- Proposed change:
  - Turn into portfolio landing page.
  - Feature short personal intro, selected projects, research interests, and recent writing.
  - Eventually source repeated text from config/data.
- Risk level:
  - Medium, because it is the first page users see and contains repeated header/footer markup.
- Edit now or later:
  - Later. Start with config and nav planning first.

### `about/index.html`

- Current purpose:
  - About page with avatar, short bio, and quote.
- Proposed change:
  - Replace with your personal bio and quant/systems positioning.
  - Add links and technical interest bullets.
- Risk level:
  - Low to medium.
- Edit now or later:
  - Phase 3.

### `blog/index.html`

- Current purpose:
  - Full writing/blog list with tag sidebar.
- Proposed change:
  - Rename conceptually to Writing/Substack.
  - Either move to `writing/index.html` or keep as a temporary alias.
  - Replace old post entries with your writing links.
- Risk level:
  - Medium, because route naming and navigation will change.
- Edit now or later:
  - Phase 7.

### `tags/index.html`

- Current purpose:
  - Tag cloud for old blog entries.
- Proposed change:
  - Remove if the portfolio does not need tag browsing.
  - Or repurpose later as topic filtering once data files exist.
- Risk level:
  - Low.
- Edit now or later:
  - Later. Remove only after new sections are working.

### `snippets/index.html`

- Current purpose:
  - Small snippet card grid.
- Proposed change:
  - Rename conceptually to Books / Notes.
  - Reuse card grid for notes.
  - Eventually move to `notes/index.html`.
- Risk level:
  - Low.
- Edit now or later:
  - Phase 6.

### `css/live.css`

- Current purpose:
  - Shared theme, layout, cards, nav, and responsive styling.
- Proposed change:
  - Preserve most existing selectors initially.
  - Add small section-specific classes only as needed.
  - Avoid a big CSS rewrite until real content reveals layout needs.
- Risk level:
  - Medium, because every page depends on it.
- Edit now or later:
  - Later, only alongside each section phase.

### `scripts/theme-toggle.js`

- Current purpose:
  - Persistent day/night mode.
- Proposed change:
  - Keep unchanged unless adding a system/light/dark three-way toggle.
- Risk level:
  - Low.
- Edit now or later:
  - Later, only if theme behavior needs to change.

### `static/images/archer-banner.jpeg`

- Current purpose:
  - Header background.
- Proposed change:
  - Replace with a personal or technical visual, or keep temporarily.
- Risk level:
  - Low.
- Edit now or later:
  - Phase 8.

### `static/images/usagi-avatar.png`

- Current purpose:
  - About avatar and apple touch icon.
- Proposed change:
  - Replace with your avatar/headshot/logo.
- Risk level:
  - Low.
- Edit now or later:
  - Phase 3 or Phase 8.

### Proposed New Files

- `README.md`
  - Purpose: local run instructions and project overview.
  - Risk: Low.
  - Phase: 1.

- `data/site.json`
  - Purpose: site title, name, tagline, links, footer text, metadata.
  - Risk: Low.
  - Phase: 1 or 2.

- `data/projects.json`
  - Purpose: project entries.
  - Risk: Low.
  - Phase: 4.

- `data/research.json`
  - Purpose: research entries.
  - Risk: Low.
  - Phase: 5.

- `data/notes.json`
  - Purpose: books/notes entries.
  - Risk: Low.
  - Phase: 6.

- `data/writing.json`
  - Purpose: writing and Substack links.
  - Risk: Low.
  - Phase: 7.

- `projects/index.html`
  - Purpose: projects page.
  - Risk: Low.
  - Phase: 2 placeholder, Phase 4 real content.

- `research/index.html`
  - Purpose: research page.
  - Risk: Low.
  - Phase: 2 placeholder, Phase 5 real content.

- `notes/index.html`
  - Purpose: books/notes page.
  - Risk: Low.
  - Phase: 2 placeholder, Phase 6 real content.

- `writing/index.html`
  - Purpose: writing/Substack page.
  - Risk: Low to medium.
  - Phase: 2 placeholder, Phase 7 real content.

## 5. Customization Strategy

The site is static HTML today, so data files will not automatically render without a build step. The safest strategy is gradual:

### Stage A: Define Data Files Without Wiring Them In

Add small JSON files under `data/` as the source of truth:

- `data/site.json`
- `data/projects.json`
- `data/research.json`
- `data/notes.json`
- `data/writing.json`

Use them as editorial references first. Keep HTML manually updated during early phases.

### Stage B: Keep HTML Simple but Mirror Data Shape

When editing HTML, structure repeated items to match the future data fields:

- `title`
- `summary`
- `tags`
- `date`
- `url`
- `status`
- `stack`
- `featured`

This makes a later build step easier if needed.

### Stage C: Optional Static Generation Later

Only after the section structure is stable, choose whether to add a tiny generator:

- Option 1: keep hand-authored static HTML.
- Option 2: add a small Node script that reads `data/*.json` and writes HTML.
- Option 3: migrate to a lightweight static site generator.

Do not introduce a framework until the static structure becomes painful to maintain.

## 6. Iteration Rules

- Do not refactor multiple sections in one commit.
- Keep each phase reviewable and reversible.
- Preserve the current shared styling unless a section clearly needs a new pattern.
- Prefer adding new routes before deleting old routes.
- Replace hardcoded identity in one layer at a time:
  - metadata,
  - header/footer,
  - About content,
  - list content.
- Keep light/dark mode working after every phase.
- Run the local server and check at least the changed page plus homepage before committing.
- Avoid introducing dependencies until there is a clear maintenance benefit.
- Make commits with descriptive messages, for example:
  - `Add portfolio data skeleton`
  - `Update navigation for portfolio sections`
  - `Draft personal about page`
  - `Add projects page`
  - `Add research page`
