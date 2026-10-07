# fedehuneeus.com

Source of the personal website of Federico Huneeus. Static site built with
[Jekyll](https://jekyllrb.com) and hosted for free on **GitHub Pages**
at the custom domain `www.fedehuneeus.com`.

Nothing needs to be installed to update the site: edit a text file, commit,
push (or edit directly on github.com) and GitHub rebuilds the site in about a
minute.

## Folder map

| Path | What it is |
|---|---|
| `_data/*.yml` | **All the content.** One file per section (see below). This is the only thing you normally edit. |
| `s/` | PDFs, slides, zip files, in topic subfolders: `s/research/`, `s/discussions/`, `s/policy/`, `s/teaching/`, `s/cv/`. File names are unchanged from the old site; old flat links such as `/s/AHM.pdf` are redirected to the new location by `404.html`. |
| `assets/img/` | Photos for the slideshow (`hero-*.jpg`), the portrait and the favicon. |
| `assets/css/style.css` | Design (colours, fonts, spacing). Colours are variables at the top. |
| `assets/js/main.js` | Slideshow, sticky menu, mobile menu. |
| `_includes/*.html` | HTML template of each section (About, Research, …). |
| `_layouts/default.html` | Page skeleton (head, header, footer). |
| `index.html` | The single-scroll home page: just the list of sections, in order. |
| `data.html` | The separate Data page (`/data/`). |
| `404.html` | Not-found page; also redirects old `/s/FILE.pdf` links to `/s/<topic>/FILE.pdf`. |
| `_config.yml` | Site title, description, URL. |
| `CNAME` | The custom domain. Do not delete. |

## How to add material

All lists are YAML: indentation matters, and a value containing a colon or
starting with a quote must be wrapped in quotes.

**New working paper / publication / work in progress** — `_data/research.yml`.
Copy an existing entry inside the right list and edit it. Drop the PDF in `s/research/`.
```yaml
  - title: My New Paper
    pdf: /s/research/MyNewPaper.pdf
    authors:
      - { name: Jane Doe, url: "https://janedoe.org" }
    links:
      - { label: Slides, url: /s/research/MyNewPaper_slides.pdf }
    status: "Submitted"                 # or journal: "Econometrica (2027)" for publications
    abstract: "Optional. If present, a small 'Abstract' toggle appears."
```
To move a paper from working papers to publications, cut the block and paste it
in the `publications:` list, replacing `status:` by `journal:`.

**New discussion** — `_data/discussions.yml`, add at the top:
```yaml
- title: Paper I Discussed
  pdf: /s/discussions/discussion_venue_YYMMDD.pdf
  venue: Conference Name
  year: 2026
```

**New policy piece** — `_data/policy.yml` (fields: `title, pdf, date, authors, summary, details`). PDF goes in `s/policy/`.

**Teaching** — `_data/teaching.yml`: change a syllabus link, add a course or a group. Syllabi go in `s/teaching/`.

**Data page** — `_data/data.yml`: add an item under the right heading, or a new heading.

**About text, email, address, social links, footer** — `_data/profile.yml`.

**Menu items** — `_data/navigation.yml` (section ids must match the `id=` of the
section in `_includes/`).

**Slideshow photos and tagline** — put a JPG (about 1800 px wide) in `assets/img/` and add a
line to `_data/hero.yml`; the one-line tagline over the photos is `tagline:` in the same file.

**References** — `_data/references.yml` (name, page url, affiliation).

**New CV** — overwrite `s/cv/CV_FHL.pdf`.

## Publishing changes

```bash
cd ~/Dropbox/Work/Website/fedehuneeus.com
git add -A
git commit -m "Add new working paper"
git push
```
GitHub Pages rebuilds automatically (Settings → Pages shows the status).
Or, on github.com, open the file under `_data/`, click the pencil icon, edit
and "Commit changes" — no terminal needed. PDFs can also be uploaded through
the web interface ("Add file → Upload files" inside the right `s/` subfolder).

## One-time setup (to be done once)

1. Create an empty **public** repository on GitHub, e.g. `fedehuneeus/fedehuneeus.com`.
2. In this folder:
   ```bash
   git init -b main
   git add -A
   git commit -m "Initial import from Squarespace"
   git remote add origin git@github.com:<USER>/fedehuneeus.com.git
   git push -u origin main
   ```
3. On GitHub: Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. Settings → Pages → Custom domain: `www.fedehuneeus.com` → Save, then tick *Enforce HTTPS* once the certificate is issued (a few minutes).
5. DNS, at the registrar of the domain (currently Squarespace Domains):
   * `www`  → `CNAME` → `<USER>.github.io`
   * apex `@` → four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (Delete the old Squarespace `A`/`CNAME` records pointing to Squarespace.)
6. When the new site is live, cancel the Squarespace *website* plan, keeping the *domain* registration (or transfer the domain to Cloudflare/Namecheap, which is cheaper).

## Local preview (optional)

Jekyll is not needed to publish. To look at changes locally before pushing,
either run the small Python renderer included here:
```bash
pip3 install --user pyyaml python-liquid      # once
python3 preview.py                            # writes _site/, open _site/index.html
```
or install a current Ruby and Jekyll (the macOS system Ruby 2.6 is too old):
```bash
brew install ruby && gem install jekyll bundler
bundle install && bundle exec jekyll serve    # then open http://127.0.0.1:4000
```
