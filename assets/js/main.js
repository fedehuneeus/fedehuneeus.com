/* Slideshow, sticky navigation bar, active-section highlight, mobile menu. */
(function () {
  'use strict';

  /* ---------- hero slideshow ---------- */
  var hero = document.getElementById('home');
  if (hero) {
    var slides = hero.querySelectorAll('.hero-slide');
    var dots = hero.querySelectorAll('.hero-dot');
    var idx = 0, timer;
    var interval = (parseFloat(hero.getAttribute('data-interval')) || 6) * 1000;
    var show = function (n) {
      slides[idx].classList.remove('is-active'); dots[idx].classList.remove('is-active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active'); dots[idx].classList.add('is-active');
    };
    var restart = function () { clearInterval(timer); timer = setInterval(function () { show(idx + 1); }, interval); };
    hero.querySelector('.hero-prev').addEventListener('click', function () { show(idx - 1); restart(); });
    hero.querySelector('.hero-next').addEventListener('click', function () { show(idx + 1); restart(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); restart(); }); });
    if (slides.length > 1) restart();
  }

  /* ---------- sticky nav appears after the hero ---------- */
  var sticky = document.getElementById('sticky-nav');
  var header = document.getElementById('header');
  if (sticky && hero) {
    var onScroll = function () {
      var past = window.scrollY > hero.offsetHeight - 50;
      sticky.classList.toggle('is-visible', past);
      sticky.setAttribute('aria-hidden', past ? 'false' : 'true');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- highlight the section currently in view ---------- */
  var links = document.querySelectorAll('a[data-section]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  if (links.length && sections.length) {
    var current = null, ticking = false;
    var update = function () {
      ticking = false;
      var probe = window.scrollY + window.innerHeight * 0.4, id = sections[0].id;
      for (var i = 0; i < sections.length; i++) { if (sections[i].offsetTop - 60 <= probe) id = sections[i].id; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) id = sections[sections.length - 1].id;
      if (id === current) return; current = id;
      links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-section') === id); });
    };
    var request = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.getElementById('overlay-nav');
  if (toggle && overlay) {
    var setOpen = function (open) {
      overlay.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setOpen(overlay.hidden); });
    overlay.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- offset anchor jumps for the sticky bar ---------- */
  document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').split('#')[1];
      var target = id && document.getElementById(id);
      if (!target || location.pathname !== '/' && a.getAttribute('href').charAt(0) === '/') return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - (id === 'header' ? 0 : 44);
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    });
  });
})();
