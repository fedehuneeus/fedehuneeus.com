#!/usr/bin/env python3
"""Minimal local renderer for this Jekyll site (no Ruby needed).
Usage: python3 preview.py [outdir]   -> writes outdir/index.html and outdir/data/index.html
Requires: pip3 install --user pyyaml python-liquid
GitHub Pages renders the site with real Jekyll; this script only approximates it for a quick look."""
import os, re, sys, glob, shutil, datetime, yaml
from liquid import Environment, FileSystemLoader

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "_site")
cfg = yaml.safe_load(open(os.path.join(ROOT, "_config.yml")))
site = dict(cfg)
site["data"] = {os.path.splitext(os.path.basename(f))[0]: yaml.safe_load(open(f)) for f in glob.glob(os.path.join(ROOT, "_data", "*.yml"))}
site["time"] = datetime.datetime.now()
site["static_files"] = [{"path": "/" + os.path.relpath(f, ROOT), "name": os.path.basename(f)}
                        for f in glob.glob(os.path.join(ROOT, "s", "**", "*"), recursive=True) if os.path.isfile(f)]

INC_RE = re.compile(r"{%\s*include\s+([\w./-]+)((?:\s+\w+=(?:\"[^\"]*\"|'[^']*'|[\w.\[\]-]+))*)\s*%}")
def jekyllify(src):
    def rep(m):
        name, args = m.group(1), m.group(2).strip()
        kw = ", ".join(a.replace("=", ": ", 1) for a in args.split()) if args else ""
        return "{%% include '%s'%s %%}" % (name, (", " + kw) if kw else "")
    src = INC_RE.sub(rep, src)
    return re.sub(r"\binclude\.(\w+)", r"\1", src)   # Jekyll's include.x -> plain variable

class Loader(FileSystemLoader):
    def get_source(self, env, name, **kw):
        s = super().get_source(env, name, **kw)
        return s._replace(text=jekyllify(s.text))

env = Environment(loader=Loader(os.path.join(ROOT, "_includes")))
baseurl = cfg.get("baseurl", "") or ""
def relative_url(v): v = str(v); return baseurl + v if v.startswith("/") else v
def absolute_url(v): v = str(v); return cfg["url"] + baseurl + v if v.startswith("/") else v
env.add_filter("relative_url", relative_url)
env.add_filter("absolute_url", absolute_url)

def front_matter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    return (yaml.safe_load(m.group(1)) or {}, m.group(2)) if m else ({}, text)

def render_page(path, url):
    fm, body = front_matter(open(path).read())
    page = dict(fm); page["url"] = url
    html = env.from_string(jekyllify(body)).render(site=site, page=page, include={})
    layout = open(os.path.join(ROOT, "_layouts", fm.get("layout", "default") + ".html")).read()
    return env.from_string(jekyllify(layout)).render(site=site, page=page, content=html)

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, "index.html"), "w").write(render_page(os.path.join(ROOT, "index.html"), "/"))
os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
open(os.path.join(OUT, "data", "index.html"), "w").write(render_page(os.path.join(ROOT, "data.html"), "/data/"))
open(os.path.join(OUT, "404.html"), "w").write(render_page(os.path.join(ROOT, "404.html"), "/404.html"))
for d in ("assets", "s"):
    dst = os.path.join(OUT, d)
    if os.path.islink(dst): os.unlink(dst)
    elif os.path.exists(dst): shutil.rmtree(dst)
    os.symlink(os.path.join(ROOT, d), dst)
print("rendered to", OUT)
