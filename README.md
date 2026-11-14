# Krish Gondaliya's portfolio

The portfolio uses static HTML, with Jekyll generating the blog at `/src/blogs/`
and the puzzle list and solution pages at `/src/puzzles/`.
The existing portfolio pages and URLs stay in place.

## Write a blog post

1. Create `_posts/YYYY-MM-DD-your-post-title.md`, using the publication date.
2. Add YAML front matter, followed by your Markdown:

   ```markdown
   ---
   title: "Your post title"
   description: "A short summary for the blog list and search engines."
   tags: [systems, cpp]
   ---

   Your introduction.

   ## A section

   Your writing goes here.
   ```

3. Preview it locally. The blog list automatically shows posts newest first.
4. Commit the post and merge it into the site's publishing branch when ready.

`layout: post` is supplied automatically. Posts get URLs such as
`/src/blogs/2026/11/13/your-post-title/`. Keep the filename stable after publishing
to preserve the URL. Quote titles and descriptions containing colons.

Store post images in `static/images/blog/` and reference them in Markdown:

```markdown
![Describe what the image shows](/static/images/blog/your-image.png)
```

## Drafts

Copy `_templates/blog-post.md` to `_drafts/your-post-title.md` to start a draft.
Drafts have no date in their filenames and stay out of normal builds.
Preview them with:

```sh
bundle exec jekyll serve --drafts
```

To publish, replace the sample content, move the file to `_posts`, and add a
`YYYY-MM-DD-` prefix. Future-dated posts are excluded until their date arrives
and a new build runs. `published: false` also excludes a post.

Draft files committed to a public GitHub repository are publicly readable, even
though they are excluded from the website.

## Write a puzzle solution log

Each puzzle is a Markdown file under `_puzzles/`. Jekyll builds a blog-style
list grouped by platform and a solution page for each entry automatically.
Existing Jane Street entries live in `_puzzles/jane-street/`.

1. Copy `_templates/puzzle.md` into `_puzzles/jane-street/` with a descriptive
   filename, such as `2026-11-your-puzzle.md`.
2. Set the title, puzzle month, platform, and original puzzle link:

   ```yaml
   ---
   title: "Your puzzle title"
   description: "A short summary of the puzzle and your approach."
   date: 2026-11-01
   platform: Jane Street Puzzles
   puzzle_url: "https://www.janestreet.com/puzzles/your-puzzle-index/"
   published: true
   ---
   ```

3. Write the solution below the front matter in Markdown. Headings, lists,
   links, fenced code blocks, images, and tables are supported.
4. Open <http://127.0.0.1:4000/src/puzzles/> and select a puzzle to read its log.

Puzzles are grouped by `platform` and ordered by `date`, newest first.
A new platform name creates its own group automatically.
`platform` defaults to `Jane Street Puzzles`; `puzzle_url` can be omitted for a
solution page without an external source link. Keep `date` in `YYYY-MM-DD` format.
The list uses `description` as the summary, or an excerpt of the solution when
no description is provided.

The template starts with `published: false`. Change it to `true` to display the
entry. Hidden puzzle entries stay out of both the list and generated pages,
even with `--drafts`; that flag previews blog drafts. Future-dated puzzles
appear after their date arrives and a new build runs.

Solution pages inherit `layout: puzzle` and use paths such as
`/src/puzzles/jane-street/2026-05-arch-madness/`. Keep filenames stable after
publishing to preserve their URLs. Puzzles stay separate from blog posts.
The template folder is excluded from Jekyll output by its underscore prefix.

## Local preview

Install Ruby and Bundler first. On Windows, use RubyInstaller with Devkit or WSL.
Dependencies should be installed and commands run in the same environment.

```sh
bundle install
bundle exec jekyll serve
```

Open <http://127.0.0.1:4000/src/blogs/>. The server rebuilds after edits.
Restart it after changing `_config.yml`.

For the Ubuntu WSL environment used to validate this checkout, from PowerShell:

```powershell
wsl -d Ubuntu-22.04 -- bash -lc 'cd /mnt/c/Users/krish/Downloads/blog-worktree && bundle config set --local path vendor/bundle && bundle install && bundle exec jekyll serve --drafts --force_polling'
```

For a production build:

```sh
bundle exec jekyll build
```

Generated files go into `_site/` and should not be committed. A plain static
file server cannot render the Liquid templates or Markdown posts.

## GitHub Pages

This setup supports GitHub Pages' built-in Jekyll build. In the repository's
**Settings > Pages**, use **Deploy from a branch**, with **main** and **/(root)**
as the source, when ready to publish. The `blog-worktree` branch is for development;
merge reviewed changes into `main` to publish through that configuration.

If Pages currently uses a custom Actions workflow, that workflow must run Jekyll
and publish `_site/`, rather than upload the unbuilt repository.

`CNAME` preserves `www.krishgondaliya.com`; `_config.yml` sets canonical URLs to
the same domain. No theme is used, so the portfolio keeps its existing design.

Official guides:
- [Writing Jekyll posts](https://jekyllrb.com/docs/posts/)
- [Testing GitHub Pages locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Configuring the Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
