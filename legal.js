/* Reveal-on-click for the operator's tax number (NIF).
   The value is stored encoded so it is not published as plain text in the
   page source or indexed by search engines; it is shown when a visitor asks. */
document.querySelectorAll('[data-reveal]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var value = atob(btn.getAttribute('data-reveal')).split('').reverse().join('');
    var out = document.createElement('span');
    out.className = 'revealed-value';
    out.textContent = value.replace(/(\d{3})(?=\d)/g, '$1 ');
    btn.replaceWith(out);
  });
});
