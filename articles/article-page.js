/* ═══════════════════════════════════════════════════════════════
   LUSONUSA — Article page behaviour: reading progress + active TOC link
   ═══════════════════════════════════════════════════════════════ */

(function () {
  const bar = document.getElementById('progressBar');
  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';

    // Only the visible language's TOC and sections are considered.
    const toc = [...document.querySelectorAll('.toc-list')].find(l => l.offsetParent !== null);
    if (!toc) return;
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    let current = links[0];
    links.forEach(link => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      if (section && section.getBoundingClientRect().top < 160) current = link;
    });
    links.forEach(link => {
      const on = link === current;
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('lusonusa:lang', onScroll);
  update();
})();
