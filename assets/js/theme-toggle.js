/* Light/dark switch. Default: the reader's system setting.
   A click keeps the choice in sessionStorage for the rest of the visit, so it carries over
   between the two pages. Choosing the system's own mode clears it again. Nothing is sent anywhere. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn || !window.matchMedia) return;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  function systemMode() { return system.matches ? 'dark' : 'light'; }
  function mode() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : systemMode();
  }
  function label() {
    var text = 'Switch to ' + (mode() === 'dark' ? 'light' : 'dark') + ' mode';
    btn.setAttribute('aria-label', text);
    btn.title = text;
  }
  function set(next) {
    var follow = next === systemMode();
    if (follow) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', next);
    try {
      if (follow) sessionStorage.removeItem('theme'); else sessionStorage.setItem('theme', next);
    } catch (e) {}
    label();
  }
  btn.addEventListener('click', function () { set(mode() === 'dark' ? 'light' : 'dark'); });
  if (system.addEventListener) system.addEventListener('change', label);
  // A page restored by the Back button keeps its old state: bring it in line with the stored choice.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var t = null;
    try { t = sessionStorage.getItem('theme'); } catch (err) {}
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    label();
  });
  btn.hidden = false;
  label();
})();
