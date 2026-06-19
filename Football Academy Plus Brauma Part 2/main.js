/* ============================================================
   Football Academy Plus Bruma — main.js
   Part 3 · Fully Functional External JavaScript
   ============================================================ */
'use strict';

/* ── Utilities ── */
function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   1. PAGE FADE-IN
   ============================================================ */
function initPageFade() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.45s ease';
  on(window, 'load', function () { document.body.style.opacity = '1'; });
}

/* ============================================================
   2. HEADER SCROLL PROGRESS + SHADOW
   ============================================================ */
function initHeaderEffects() {
  var header = qs('header.site-header');
  if (!header) return;
  var bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  header.appendChild(bar);
  var tick = false;
  function update() {
    var st = window.scrollY;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
    header.classList.toggle('scrolled', st > 10);
    tick = false;
  }
  on(window, 'scroll', function () { if (!tick) { requestAnimationFrame(update); tick = true; } }, { passive: true });
  update();
}

/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
function initMobileMenu() {
  var inner = qs('.header-inner');
  var nav   = qs('nav.main-nav');
  if (!inner || !nav) return;
  var burger = document.createElement('button');
  burger.className = 'burger-btn';
  burger.setAttribute('aria-label', 'Open navigation menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span><span></span><span></span>';
  inner.appendChild(burger);
  function close() { nav.classList.remove('nav-open'); burger.classList.remove('burger-open'); burger.setAttribute('aria-expanded','false'); }
  function open()  { nav.classList.add('nav-open');    burger.classList.add('burger-open');    burger.setAttribute('aria-expanded','true'); }
  on(burger, 'click', function (e) { e.stopPropagation(); nav.classList.contains('nav-open') ? close() : open(); });
  qsa('a', nav).forEach(function (a) { on(a, 'click', close); });
  on(document, 'click', function (e) { if (nav.classList.contains('nav-open') && !nav.contains(e.target) && !burger.contains(e.target)) close(); });
  on(document, 'keydown', function (e) { if (e.key === 'Escape') close(); });
}

/* ============================================================
   4. AUTO ACTIVE NAV LINK
   ============================================================ */
function initActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'Home.html';
  qsa('nav.main-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop().split('#')[0];
    if (href.toLowerCase() === page.toLowerCase()) a.classList.add('active');
  });
}

/* ============================================================
   5. SCROLL REVEAL — EXCLUDES product-card (fixes search bug)
   ============================================================ */
function initScrollReveal() {
  if (!window.IntersectionObserver) return;
  /* NOTE: .product-card intentionally excluded — scroll reveal's
     opacity:0 was preventing the search filter from being visible */
  /* IMPORTANT: .product-card and .products-grid are NEVER included here.
     Scroll reveal sets opacity:0 which conflicts with the product search filter.
     Product cards must always remain at opacity:1 and display:'' */
  var els = qsa('.stat-box, .about-img-wrap, .hero-badge, .sessions-note, .enq-info-list li, .signup-feature');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return;
      setTimeout(function () { entry.target.classList.add('revealed'); }, i * 60);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el) { el.classList.add('reveal-hidden'); io.observe(el); });
}

/* ============================================================
   6. STAT COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  if (!window.IntersectionObserver) return;
  var nums = qsa('.stat-box .num');
  if (!nums.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el  = entry.target;
      var raw = el.textContent.trim();
      var num = parseInt(raw.replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > 50) {
        var cur = 0, step = Math.ceil(num / 70);
        var t = setInterval(function () {
          cur += step;
          if (cur >= num) { cur = num; clearInterval(t); }
          el.textContent = raw.replace(/[0-9]+/, cur.toLocaleString());
        }, 16);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(function (el) { io.observe(el); });
}

/* ============================================================
   7. PRODUCT SEARCH — FIXED (no scroll-reveal conflict)
   ============================================================ */
function initProductSearch() {
  var input = document.getElementById('productSearch');
  if (!input) return;

  /* ── STEP 1: Force every product card fully visible immediately ── */
  function resetCards() {
    qsa('.product-card').forEach(function (c) {
      c.classList.remove('reveal-hidden', 'revealed');
      c.removeAttribute('style');          /* wipe ALL inline styles */
      c.style.display   = '';
      c.style.opacity   = '1';
      c.style.visibility = 'visible';
      c.style.transform = 'none';
      c.style.transition = 'none';
    });
  }
  resetCards();

  /* Also reset again after any pending timeouts from scroll reveal */
  setTimeout(resetCards, 100);
  setTimeout(resetCards, 500);

  /* ── STEP 2: Clear button ── */
  var clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'search-clear-btn';
  clearBtn.innerHTML = '&times;';
  clearBtn.setAttribute('aria-label', 'Clear search');
  clearBtn.style.display = 'none';
  input.parentNode.appendChild(clearBtn);

  /* ── STEP 3: No-results message ── */
  var noMsg = document.createElement('p');
  noMsg.className = 'no-result-msg';
  noMsg.textContent = 'No products found. Try searching: boots, shin pads, tape, shirt…';
  noMsg.style.display = 'none';
  var grid = qs('.products-grid');
  if (grid && grid.parentNode) {
    grid.parentNode.insertBefore(noMsg, grid.nextSibling);
  }

  /* ── STEP 4: The filter — dead simple, no CSS class tricks ── */
  function runFilter() {
    var q = input.value.trim().toLowerCase();

    /* Re-ensure cards are reset before filtering */
    qsa('.product-card').forEach(function (card) {
      /* Strip reveal classes in case scroll reveal ran after our reset */
      card.classList.remove('reveal-hidden');
      card.style.opacity    = '1';
      card.style.visibility = 'visible';
      card.style.transform  = 'none';
    });

    var cards   = qsa('.product-card');
    var visible = 0;

    cards.forEach(function (card) {
      /* Read text from the card's child elements */
      var name  = '';
      var sub   = '';
      var price = '';

      var nameEl  = card.querySelector('.product-name');
      var subEl   = card.querySelector('.product-sub');
      var priceEl = card.querySelector('.product-price');

      if (nameEl)  name  = nameEl.textContent  || nameEl.innerText  || '';
      if (subEl)   sub   = subEl.textContent   || subEl.innerText   || '';
      if (priceEl) price = priceEl.textContent || priceEl.innerText || '';

      var combined = (name + ' ' + sub + ' ' + price).toLowerCase();
      var matches  = !q || combined.indexOf(q) !== -1;

      if (matches) {
        card.style.display    = '';
        card.style.opacity    = '1';
        card.style.visibility = 'visible';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    noMsg.style.display    = (visible === 0 && q !== '') ? 'block' : 'none';
    clearBtn.style.display = q ? 'flex' : 'none';
  }

  /* ── STEP 5: Attach events ── */
  on(input, 'input',   runFilter);
  on(input, 'keyup',   runFilter);
  on(input, 'change',  runFilter);
  on(clearBtn, 'click', function () {
    input.value = '';
    runFilter();
    resetCards();
    input.focus();
  });
}

/* ============================================================
   8. PRODUCT LIGHTBOX
   ============================================================ */
function initLightbox() {
  var imgs = qsa('.product-card .img-wrap img');
  if (!imgs.length) return;

  var overlay = document.createElement('div');
  overlay.id = 'lbOverlay';
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = [
    '<div class="lb-box">',
      '<button class="lb-close" aria-label="Close">&times;</button>',
      '<div class="lb-stage">',
        '<button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>',
        '<div class="lb-img-wrap"><img class="lb-img" src="" alt=""></div>',
        '<button class="lb-nav lb-next" aria-label="Next">&#8250;</button>',
      '</div>',
      '<p class="lb-caption"></p>',
      '<div class="lb-dots"></div>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);

  var lbImg  = qs('.lb-img', overlay);
  var lbCap  = qs('.lb-caption', overlay);
  var lbDots = qs('.lb-dots', overlay);
  var cur    = 0;

  imgs.forEach(function (_, i) {
    var d = document.createElement('button');
    d.className = 'lb-dot';
    d.setAttribute('aria-label', 'Image ' + (i + 1));
    on(d, 'click', function () { go(i); });
    lbDots.appendChild(d);
  });

  function syncDots() { qsa('.lb-dot', lbDots).forEach(function (d, i) { d.classList.toggle('lb-dot-active', i === cur); }); }

  function go(i) {
    cur = ((i % imgs.length) + imgs.length) % imgs.length;
    lbImg.style.opacity = '0';
    setTimeout(function () {
      lbImg.src = imgs[cur].src; lbImg.alt = imgs[cur].alt;
      lbCap.textContent = imgs[cur].alt;
      lbImg.style.opacity = '1';
    }, 150);
    syncDots();
  }

  function openAt(i) { cur = i; lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt; lbCap.textContent = imgs[i].alt; overlay.classList.add('lb-open'); document.body.style.overflow = 'hidden'; syncDots(); qs('.lb-close', overlay).focus(); }
  function close()   { overlay.classList.remove('lb-open'); document.body.style.overflow = ''; }

  imgs.forEach(function (img, i) {
    img.style.cursor = 'zoom-in'; img.tabIndex = 0;
    on(img, 'click',   function () { openAt(i); });
    on(img, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); } });
  });

  on(qs('.lb-prev', overlay), 'click', function () { go(cur - 1); });
  on(qs('.lb-next', overlay), 'click', function () { go(cur + 1); });
  on(qs('.lb-close', overlay), 'click', close);
  on(overlay, 'click', function (e) { if (e.target === overlay) close(); });
  on(document, 'keydown', function (e) {
    if (!overlay.classList.contains('lb-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  });

  var tx = 0;
  on(overlay, 'touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  on(overlay, 'touchend',   function (e) { var dx = tx - e.changedTouches[0].clientX; if (Math.abs(dx) > 45) go(dx > 0 ? cur + 1 : cur - 1); });
}

/* ============================================================
   9. NEWS TICKER
   ============================================================ */
function initTicker() {
  var wrap = document.getElementById('newsTicker');
  if (!wrap) return;
  var items = [
    '⚽&nbsp; Sessions open Monday–Friday &nbsp;·&nbsp; Walk-ins welcome!',
    '👟&nbsp; Football Boots from R150 &nbsp;·&nbsp; Shin Pads R50 per pair',
    '📋&nbsp; Registration open for ages 6–18 &nbsp;·&nbsp; Sign up today',
    '🏆&nbsp; Plus Bruma FA &nbsp;·&nbsp; Where Stars Are Born since 2019',
    '📞&nbsp; Call: 084 836 1091 &nbsp;·&nbsp; faplusbruma@gmail.com',
  ];
  var idx = 0;
  var span = document.createElement('span');
  span.className = 'ticker-text';
  span.innerHTML = items[0];
  wrap.appendChild(span);
  setInterval(function () {
    span.style.opacity   = '0';
    span.style.transform = 'translateY(-10px)';
    setTimeout(function () {
      idx = (idx + 1) % items.length;
      span.innerHTML       = items[idx];
      span.style.opacity   = '1';
      span.style.transform = 'translateY(0)';
    }, 380);
  }, 4200);
}

/* ============================================================
   10. FORM VALIDATOR HELPER
   ============================================================ */
function makeValidator(form, rules) {
  function mark(r, fail) {
    if (!r.el) return;
    var e = document.getElementById(r.el.id + 'Err');
    if (e) { e.textContent = fail ? r.msg : ''; e.style.display = fail ? 'block' : 'none'; }
    r.el.classList.toggle('input-error',   fail);
    r.el.classList.toggle('input-success', !fail && r.el.value.trim() !== '');
    r.el.setAttribute('aria-invalid', String(fail));
  }
  function validateAll() {
    var ok = true;
    Object.values(rules).forEach(function (r) {
      if (!r.el) return;
      var pass = r.test(r.el.value);
      mark(r, !pass);
      if (!pass) ok = false;
    });
    return ok;
  }
  Object.values(rules).forEach(function (r) {
    if (!r.el) return;
    on(r.el, 'blur',  function () { mark(r, !r.test(r.el.value)); });
    on(r.el, 'input', function () { if (r.el.classList.contains('input-error')) mark(r, !r.test(r.el.value)); });
  });
  return { validateAll: validateAll, mark: mark };
}

/* ============================================================
   11. ENQUIRY FORM
   ============================================================ */
function initEnquiryForm() {
  var form = document.getElementById('enquiryForm');
  if (!form) return;
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_PHONE = /^0[0-9]{9}$/;
  var rules = {
    enqName:    { el: qs('#enqName',    form), msg: 'Please enter your full name (min 2 characters).',       test: function(v){ return v.trim().length >= 2; } },
    enqPhone:   { el: qs('#enqPhone',   form), msg: 'Enter a valid SA number — 10 digits starting with 0.', test: function(v){ return RE_PHONE.test(v.trim().replace(/[\s\-]/g,'')); } },
    enqEmail:   { el: qs('#enqEmail',   form), msg: 'Please enter a valid email address.',                   test: function(v){ return RE_EMAIL.test(v.trim()); } },
    enqType:    { el: qs('#enqType',    form), msg: 'Please select an enquiry type.',                        test: function(v){ return v !== ''; } },
    enqMessage: { el: qs('#enqMessage', form), msg: 'Please enter a message (min 10 characters).',           test: function(v){ return v.trim().length >= 10; } },
  };
  var v = makeValidator(form, rules);

  var msgEl = qs('#enqMessage', form);
  var ctrEl = document.getElementById('enqMsgCount');
  if (msgEl && ctrEl) {
    on(msgEl, 'input', function () {
      var len = msgEl.value.length;
      ctrEl.textContent = len + ' / 500';
      ctrEl.style.color = len > 450 ? '#E05252' : 'var(--text-muted)';
    });
  }

  on(form, 'submit', function (e) {
    e.preventDefault();
    if (!v.validateAll()) { var f = qs('.input-error', form); if (f) f.scrollIntoView({ behavior:'smooth', block:'center' }); return; }

    var name = rules.enqName.el.value.trim();
    var type = rules.enqType.el.value;
    var DATA = {
      training:     { icon:'⚽', title:'Training Session Enquiry',  lines:['📅 Schedule: Monday – Friday, 08:00 – 18:00','💰 Cost: R200 per session','📍 Location: 26 Hans Pirow Rd, Bruma, Johannesburg','📞 Book: 084 836 1091  ·  faplusbruma@gmail.com','','A coach will contact you within 24 hours to confirm.'] },
      product:      { icon:'👟', title:'Product Enquiry',           lines:['Current gear at the academy:','','⚽ Shin Pads — R50/pair','🩹 Medical Tape — R95/roll','👕 Compression Top — R170','👟 Football Boots — R300/pair','🟡 Club T-Shirt — R80','👟 Second Hand Boots — R150/pair','','We will email a full gear list within 24 hours.'] },
      registration: { icon:'📋', title:'Player Registration',       lines:['👦👧 Ages: 6 – 18 years  ·  Boys & Girls welcome','','Documents required:','  • Certified birth certificate copy','  • Guardian / parent ID copy','  • One passport-size photo','','We will email the registration form within 1–2 business days.'] },
      general:      { icon:'💬', title:'Enquiry Received',          lines:['We have received your enquiry and will respond within 1–2 business days.','','📞 Call: 084 836 1091 (Mon–Fri, 08:00–17:00)','✉ Email: faplusbruma@gmail.com'] },
    };
    var d = DATA[type] || DATA['general'];
    var box = document.getElementById('enqSuccessBox');
    if (!box) { box = document.createElement('div'); box.id = 'enqSuccessBox'; box.className = 'enq-success-box'; form.parentNode.insertBefore(box, form.nextSibling); }
    box.innerHTML =
      '<div class="enq-success-icon">' + d.icon + '</div>' +
      '<h3 class="enq-success-title">' + esc(d.title) + '</h3>' +
      '<p class="enq-success-name">Hello <strong>' + esc(name) + '</strong>, here\'s what you need to know:</p>' +
      '<div class="enq-success-body">' + d.lines.map(function(l){ return l ? '<p>' + esc(l) + '</p>' : '<br>'; }).join('') + '</div>' +
      '<button type="button" class="btn-outline enq-reset-btn">← Submit Another Enquiry</button>';
    box.style.display  = 'block';
    form.style.display = 'none';
    box.scrollIntoView({ behavior:'smooth', block:'center' });
    on(qs('.enq-reset-btn', box), 'click', function () {
      box.style.display  = 'none'; form.style.display = 'block'; form.reset();
      if (ctrEl) ctrEl.textContent = '0 / 500';
      qsa('.input-error,.input-success', form).forEach(function(el){ el.classList.remove('input-error','input-success'); });
    });
  });
}

/* ============================================================
   12. CONTACT FORM (mailto)
   ============================================================ */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var rules = {
    ctName:    { el: qs('#ctName',    form), msg: 'Please enter your full name.',                          test: function(v){ return v.trim().length >= 2; } },
    ctEmail:   { el: qs('#ctEmail',   form), msg: 'Please enter a valid email address.',                   test: function(v){ return RE_EMAIL.test(v.trim()); } },
    ctPhone:   { el: qs('#ctPhone',   form), msg: 'Enter a valid 10-digit SA number (or leave blank).',   test: function(v){ return !v.trim() || /^0[0-9]{9}$/.test(v.trim().replace(/[\s\-]/g,'')); } },
    ctSubject: { el: qs('#ctSubject', form), msg: 'Please select a message type.',                         test: function(v){ return v !== ''; } },
    ctMessage: { el: qs('#ctMessage', form), msg: 'Please enter a message (min 10 characters).',           test: function(v){ return v.trim().length >= 10; } },
  };
  var v = makeValidator(form, rules);
  on(form, 'submit', function (e) {
    e.preventDefault();
    if (!v.validateAll()) { var f = qs('.input-error', form); if (f) f.scrollIntoView({ behavior:'smooth', block:'center' }); return; }
    var name = rules.ctName.el.value.trim(), email = rules.ctEmail.el.value.trim(), phone = rules.ctPhone.el.value.trim();
    var sel = rules.ctSubject.el, subject = sel.options[sel.selectedIndex].text, message = rules.ctMessage.el.value.trim();
    window.location.href = 'mailto:faplusbruma@gmail.com?subject=' + encodeURIComponent('[Plus Bruma FA] ' + subject) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone||'Not provided') + '\n\nMessage:\n' + message);
    var banner = qs('.form-banner', form);
    if (!banner) { banner = document.createElement('div'); banner.className = 'form-banner'; form.appendChild(banner); }
    banner.innerHTML = '<strong>✓ Email client opening!</strong><br>Thank you <strong>' + esc(name) + '</strong>! Your message to faplusbruma@gmail.com is pre-filled — just click Send.';
    banner.style.display = 'block';
    form.reset();
    qsa('.input-error,.input-success', form).forEach(function(el){ el.classList.remove('input-error','input-success'); });
    banner.scrollIntoView({ behavior:'smooth', block:'center' });
  });
}

/* ============================================================
   13. SIGN-UP FORM — Multi-step
   ============================================================ */
function initSignUpForm() {
  var form = document.getElementById('signUpForm');
  if (!form) return;
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_PHONE = /^0[0-9]{9}$/;
  var RE_ID    = /^[0-9]{13}$/;

  var rules = {
    suFirstName: { el: qs('#suFirstName',form), msg:'Please enter a first name (min 2 characters).',            test:function(v){ return v.trim().length >= 2; } },
    suLastName:  { el: qs('#suLastName', form), msg:'Please enter a last name (min 2 characters).',             test:function(v){ return v.trim().length >= 2; } },
    suDob: {
      el: qs('#suDob', form), msg:'Player must be between 6 and 18 years old.',
      test: function(v) {
        if (!v) return false;
        var d = new Date(v), now = new Date();
        var age = now.getFullYear() - d.getFullYear();
        if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
        return age >= 6 && age <= 18;
      }
    },
    suGender:   { el: qs('#suGender',   form), msg:'Please select a gender.',                                   test:function(v){ return v !== ''; } },
    suGuardian: { el: qs('#suGuardian', form), msg:"Please enter the guardian's full name.",                     test:function(v){ return v.trim().length >= 4; } },
    suPhone:    { el: qs('#suPhone',    form), msg:'Enter a valid SA number — 10 digits starting with 0.',      test:function(v){ return RE_PHONE.test(v.trim().replace(/[\s\-]/g,'')); } },
    suEmail:    { el: qs('#suEmail',    form), msg:'Please enter a valid email address.',                        test:function(v){ return RE_EMAIL.test(v.trim()); } },
    suIdNum:    { el: qs('#suIdNum',    form), msg:'SA ID number must be exactly 13 digits.',                   test:function(v){ return RE_ID.test(v.trim()); } },
    suPosition: { el: qs('#suPosition', form), msg:'Please select a preferred position.',                        test:function(v){ return v !== ''; } },
    suConsent:  { el: qs('#suConsent',  form), msg:'You must agree to the terms to complete registration.',     test:function(){ return qs('#suConsent',form) && qs('#suConsent',form).checked; } },
  };

  var v = makeValidator(form, rules);

  /* Live age display */
  var dobEl  = qs('#suDob', form);
  var ageOut = document.getElementById('suAgeDisplay');
  if (dobEl && ageOut) {
    on(dobEl, 'change', function () {
      var d = new Date(dobEl.value), now = new Date();
      var age = now.getFullYear() - d.getFullYear();
      if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
      if (!isNaN(age) && dobEl.value) {
        ageOut.textContent = 'Age: ' + age + ' year' + (age === 1 ? '' : 's');
        ageOut.style.color   = (age >= 6 && age <= 18) ? '#4CAF7D' : '#E05252';
        ageOut.style.display = 'block';
      }
    });
  }

  /* Multi-step */
  var steps     = qsa('.signup-step', form);
  var stepDots  = qsa('.step-dot');
  var connectors= qsa('.step-connector');
  var curStep   = 0;

  function showStep(n) {
    steps.forEach(function (s, i)      { s.classList.toggle('step-active', i === n); s.classList.toggle('step-past', i < n); });
    stepDots.forEach(function (d, i)   { d.classList.toggle('dot-active', i === n); d.classList.toggle('dot-complete', i < n); });
    connectors.forEach(function (c, i) { c.classList.toggle('connector-done', i < n); });
    var counter = document.getElementById('stepCounter');
    if (counter) counter.textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
    curStep = n;

    /* Populate review on step 3 (index 2) */
    if (n === 2) populateReview();

    form.closest('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function populateReview() {
    var rev = document.getElementById('reviewSummary');
    if (!rev) return;
    function val(id) { var el = qs('#' + id, form); return el ? el.value.trim() : ''; }
    function optText(id) { var el = qs('#' + id, form); return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].text : ''; }
    rev.innerHTML = [
      row('Player Name',    val('suFirstName') + ' ' + val('suLastName')),
      row('Date of Birth',  val('suDob')),
      row('Gender',         optText('suGender')),
      row('Position',       optText('suPosition')),
      row('Guardian',       val('suGuardian')),
      row('Phone',          val('suPhone')),
      row('Email',          val('suEmail')),
    ].join('');
  }

  function row(label, value) {
    return '<div class="review-row"><span class="review-label">' + esc(label) + '</span><span class="review-val">' + esc(value || '—') + '</span></div>';
  }

  /* Next buttons */
  qsa('.btn-next', form).forEach(function (btn) {
    on(btn, 'click', function () {
      var keys = (btn.dataset.validates || '').split(',').map(function(k){ return k.trim(); }).filter(Boolean);
      var ok = true;
      keys.forEach(function (key) {
        if (!rules[key]) return;
        var pass = rules[key].test(rules[key].el ? rules[key].el.value : '');
        v.mark(rules[key], !pass);
        if (!pass) ok = false;
      });
      if (ok) { if (curStep < steps.length - 1) showStep(curStep + 1); }
      else { var f = qs('.input-error', steps[curStep]); if (f) f.scrollIntoView({ behavior:'smooth', block:'center' }); }
    });
  });

  /* Back buttons */
  qsa('.btn-back', form).forEach(function (btn) { on(btn, 'click', function () { if (curStep > 0) showStep(curStep - 1); }); });

  if (steps.length) showStep(0);

  /* Submit */
  on(form, 'submit', function (e) {
    e.preventDefault();
    if (!v.validateAll()) {
      var firstErr = qs('.input-error', form);
      if (firstErr) { var errStep = firstErr.closest('.signup-step'); if (errStep) showStep(steps.indexOf(errStep)); setTimeout(function(){ firstErr.scrollIntoView({ behavior:'smooth', block:'center' }); }, 300); }
      return;
    }
    function val(id) { var el = qs('#' + id, form); return el ? el.value.trim() : ''; }
    function optText(id) { var el = qs('#' + id, form); return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].text : ''; }
    var fn = val('suFirstName'), ln = val('suLastName');
    var box = document.getElementById('signUpSuccess');
    if (box) {
      box.innerHTML = [
        '<div class="su-success-trophy">🏆</div>',
        '<h2 class="su-success-title">Welcome to Plus Bruma FA!</h2>',
        '<p class="su-success-sub">Registration submitted for <strong>' + esc(fn + ' ' + ln) + '</strong></p>',
        '<div class="su-success-card">',
          row2('Player',       fn + ' ' + ln),
          row2('Date of Birth', val('suDob')),
          row2('Gender',        optText('suGender')),
          row2('Position',      optText('suPosition')),
          row2('Guardian',      val('suGuardian')),
          row2('Phone',         val('suPhone')),
          row2('Email',         val('suEmail')),
          '<div class="su-row"><span class="su-label">Status</span><span class="su-val su-status-pending">⏳ Pending Review</span></div>',
        '</div>',
        '<p class="su-success-note">We will contact you within <strong>2–3 business days</strong> to confirm your registration. Please bring all required documents on your first visit to the academy.</p>',
        '<div class="su-success-actions"><a href="Sessions.html" class="btn-gold">View Sessions</a><a href="Home.html" class="btn-outline">Back to Home</a></div>'
      ].join('');
      box.style.display = 'block';
      form.style.display = 'none';
      var stepper = qs('.signup-stepper'); if (stepper) stepper.style.display = 'none';
      var counter = document.getElementById('stepCounter'); if (counter) counter.style.display = 'none';
      box.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });

  function row2(label, value) {
    return '<div class="su-row"><span class="su-label">' + esc(label) + '</span><span class="su-val">' + esc(value || '—') + '</span></div>';
  }
}

/* ============================================================
   14. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '&#8679;';
  btn.setAttribute('aria-label', 'Scroll back to top');
  document.body.appendChild(btn);
  on(window, 'scroll', function () { btn.classList.toggle('btt-show', window.scrollY > 500); }, { passive: true });
  on(btn, 'click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* ============================================================
   15. FOOTER AUTO YEAR
   ============================================================ */
function initFooterYear() {
  qsa('.footer-copy').forEach(function (el) {
    var y = new Date().getFullYear();
    if (!el.textContent.includes(String(y))) el.textContent = el.textContent.trim() + ' · ' + y;
  });
}

/* ============================================================
   16. SMOOTH ANCHOR SCROLL
   ============================================================ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(function (a) {
    on(a, 'click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initPageFade();
  initHeaderEffects();
  initMobileMenu();
  initActiveNav();
  initScrollReveal();
  initCounters();
  /* initProductSearch runs LAST so it can override any scroll reveal that touched product cards */
  setTimeout(function () { initProductSearch(); }, 50);
  initLightbox();
  initTicker();
  initEnquiryForm();
  initContactForm();
  initSignUpForm();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
});
