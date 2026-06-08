/* AEO Canon — Audit landing + diagnostic flow.
   Self-contained interactive flow. Honors prefers-reduced-motion. */
(function () {
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- scroll reveal ---------- */
  if (!RM && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- theme ---------- */
  var TKEY = 'aeo-audit-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var lab = $('[data-theme-label]'); if (lab) lab.textContent = t === 'dark' ? 'Light' : 'Dark';
  }
  applyTheme(localStorage.getItem(TKEY) || 'light');
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-theme-toggle]')) {
      var n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(TKEY, n); applyTheme(n);
    }
  });

  /* ---------- audit data model ---------- */
  var STATE = { url: '', score: 0, band: '', biz: '', industry: '', area: '', goal: '', email: '' };

  var PILLARS = [
    { k: 'Access', d: 'Can AI crawlers read your site?' },
    { k: 'Answers', d: 'Is your content answer-shaped?' },
    { k: 'Authority', d: 'Does the web vouch for you?' },
    { k: 'Freshness', d: 'Is it current and dated?' }
  ];

  function seedFrom(s) { var n = 0; for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0; return n; }
  function scoreFor(url) {
    var s = seedFrom(url || 'demo');
    var base = 34 + (s % 42); // 34–75
    return base;
  }
  function bandFor(score) {
    if (score >= 70) return 'Established';
    if (score >= 50) return 'Emerging';
    if (score >= 30) return 'At risk';
    return 'Invisible';
  }
  function pillarScores(url, total) {
    var s = seedFrom(url + 'p');
    return PILLARS.map(function (p, i) {
      var v = 20 + ((s >>> (i * 4)) % 80);
      // pull toward total a bit
      v = Math.round((v + total) / 2);
      return Math.max(8, Math.min(98, v));
    });
  }

  /* auto-detected facts (the "intelligence visible" moment) */
  function detect(url) {
    var host = (url || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'your-site.com';
    var s = seedFrom(host);
    var industries = ['Home services', 'Auto & repair', 'Professional services', 'Food & hospitality', 'Local retail', 'Fitness & wellness'];
    var platforms = ['WordPress', 'Squarespace', 'Wix', 'Webflow', 'a custom CMS', 'Shopify'];
    return {
      host: host,
      industry: industries[s % industries.length],
      platform: platforms[(s >>> 3) % platforms.length],
      pages: 6 + (s % 40),
      schema: (s % 3 === 0),
      blog: (s % 2 === 0)
    };
  }

  var FINDINGS = function (det, ps) {
    var quick = [
      { t: 'Add a clear, answer-first opening to your top 5 pages', why: 'Engines lift the first 1–2 sentences. Lead with the answer, not a welcome.', min: '~30 min each' },
      { t: 'Publish a visible “last updated” date', why: 'Undated pages read as stale; freshness is a ranking signal.', min: '15 min' },
      { t: 'Allow AI crawlers in robots.txt', why: det.host + ' may be blocking GPTBot / PerplexityBot.', min: '10 min' }
    ];
    var structural = [
      { t: 'Build a question-first content architecture', why: 'Map the real questions your customers ask and answer each on its own page.', min: 'Ongoing' },
      { t: 'Earn third-party mentions, not just backlinks', why: 'Consistent mentions across the web are what make AI trust your name.', min: '90 days' }
    ];
    if (!det.schema) structural.unshift({ t: 'Implement LocalBusiness + service schema', why: 'No structured data found — engines are guessing what you do.', min: '1–2 days' });
    return { quick: quick, structural: structural };
  };

  /* the streamed AI summary */
  function summaryText(det, score) {
    return "Based on a scan of " + det.host + ", your business scores " + score + "/100 for AI search readiness — putting you in the \u201c" + bandFor(score) + "\u201d range. The foundation is " + (score >= 55 ? "solid" : "workable") + ": " + (det.schema ? "you have some structured data in place" : "your site lacks the structured data engines rely on") + ", and " + (det.blog ? "you're already publishing content" : "there's little question-first content for engines to cite") + ". The fastest wins are structural clarity — leading every key page with a direct answer and exposing a freshness date. The larger opportunity is authority: being described consistently across the web so ChatGPT and Perplexity recommend you by name. Handle the quick fixes this week, and the structural work over the next quarter, and " + det.host + " can realistically move into the top tier of " + det.industry.toLowerCase() + " businesses for AI visibility.";
  }

  /* ---------- flow controller ---------- */
  var root = $('#audit');
  if (!root) return;
  var stepWrap = $('#audit-steps');

  function go(step) {
    $$('.astep', stepWrap).forEach(function (s) { s.hidden = s.dataset.step !== step; });
    var prog = $('#audit-progress');
    var order = ['url', 'scan', 'score', 'questions', 'email', 'report'];
    var idx = order.indexOf(step);
    if (prog && idx >= 0) prog.style.width = Math.round((idx / (order.length - 1)) * 100) + '%';
    if (!RM) { var top = root.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: top, behavior: 'smooth' }); }
  }

  /* URL step */
  var urlForm = $('#url-form');
  urlForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#url-input').value.trim();
    var err = $('#url-error');
    if (!v || !/[a-z0-9]\.[a-z]{2,}/i.test(v)) {
      err.hidden = false; $('#url-input').setAttribute('aria-invalid', 'true'); return;
    }
    err.hidden = true; $('#url-input').removeAttribute('aria-invalid');
    STATE.url = v;
    runScan();
  });

  /* Scan (loading) */
  function runScan() {
    go('scan');
    var det = detect(STATE.url);
    STATE.detect = det;
    var lines = $$('#scan-lines .scan-line');
    lines.forEach(function (l) { l.classList.remove('done'); });
    var labels = $('#scan-host'); if (labels) labels.textContent = det.host;
    if (RM) { finishScan(); return; }
    var i = 0;
    (function next() {
      if (i >= lines.length) { setTimeout(finishScan, 380); return; }
      lines[i].classList.add('done'); i++; setTimeout(next, 520);
    })();
  }
  function finishScan() {
    STATE.score = scoreFor(STATE.url);
    STATE.band = bandFor(STATE.score);
    renderScore();
    go('score');
  }

  /* Score scorecard */
  function renderScore() {
    var det = STATE.detect;
    $('#score-host').textContent = det.host;
    var ring = $('#score-ring');
    var num = $('#score-num');
    var ps = pillarScores(STATE.url, STATE.score);
    STATE.pillars = ps;
    // band
    $('#score-band').textContent = STATE.band;
    $('#score-band').className = 'scorecard__band band--' + STATE.band.toLowerCase().replace(/[^a-z]/g, '');
    // pillars
    var pw = $('#score-pillars'); pw.innerHTML = '';
    PILLARS.forEach(function (p, i) {
      var v = ps[i];
      var el = document.createElement('div');
      el.className = 'pbar reveal in';
      el.innerHTML = '<div class="pbar__top"><span>' + p.k + '</span><b>' + v + '</b></div>' +
        '<div class="pbar__track"><i style="--w:' + v + '%"></i></div>' +
        '<div class="pbar__d">' + p.d + '</div>';
      pw.appendChild(el);
    });
    // animate ring + number
    var target = STATE.score;
    if (RM) { ring.style.setProperty('--v', target); num.textContent = target; animPillars(true); return; }
    var n = 0; var dur = 900; var t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      ring.style.setProperty('--v', (target * eased).toFixed(1));
      num.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(tick); else { num.textContent = target; animPillars(false); }
    })(performance.now());
    // guard: if rAF is throttled/paused, ensure the final value still lands
    setTimeout(function () {
      if (parseInt(num.textContent, 10) !== target) {
        ring.style.setProperty('--v', target); num.textContent = target; animPillars(true);
      }
    }, dur + 250);
  }
  function animPillars(instant) {
    $$('#score-pillars .pbar__track i').forEach(function (i, idx) {
      if (instant) { i.style.width = i.style.getPropertyValue('--w'); return; }
      setTimeout(function () { i.style.width = i.style.getPropertyValue('--w'); }, 120 * idx);
    });
  }

  $('#to-questions').addEventListener('click', function () {
    // prefill auto-detected
    var det = STATE.detect;
    $('#q-industry').value = det.industry;
    $('#detect-industry').textContent = det.industry;
    $('#detect-platform').textContent = det.platform;
    $('#detect-pages').textContent = det.pages + ' pages';
    go('questions');
  });

  /* Questions */
  $$('.choice-group').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.choice'); if (!b) return;
      $$('.choice', g).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      g.dataset.value = b.dataset.value;
    });
  });
  $('#q-form').addEventListener('submit', function (e) {
    e.preventDefault();
    STATE.industry = $('#q-industry').value;
    STATE.area = $('#q-area').value.trim();
    STATE.goal = ($('#q-goal').dataset.value) || 'More calls';
    go('email');
  });

  /* Email */
  $('#email-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#email-input').value.trim();
    var err = $('#email-error');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { err.hidden = false; return; }
    err.hidden = true; STATE.email = v;
    buildReport();
    go('report');
  });
  $('#email-skip').addEventListener('click', function () { buildReport(); go('report'); });

  /* Report */
  function buildReport() {
    var det = STATE.detect;
    $('#report-host').textContent = det.host;
    $('#report-score').textContent = STATE.score;
    $('#report-band').textContent = STATE.band;
    $('#report-meta').textContent = STATE.industry + (STATE.area ? ' · ' + STATE.area : '') + ' · goal: ' + STATE.goal;

    var f = FINDINGS(det, STATE.pillars);
    var q = $('#fix-quick'); q.innerHTML = '';
    f.quick.forEach(function (x) { q.appendChild(findingEl(x, 'quick')); });
    var s = $('#fix-structural'); s.innerHTML = '';
    f.structural.forEach(function (x) { s.appendChild(findingEl(x, 'structural')); });

    streamSummary(summaryText(det, STATE.score));
  }
  function findingEl(x, kind) {
    var el = document.createElement('div');
    el.className = 'finding finding--' + kind;
    el.innerHTML = '<div class="finding__tag">' + (kind === 'quick' ? 'Quick fix' : 'Structural') + '<span class="finding__min">' + x.min + '</span></div>' +
      '<h4>' + x.t + '</h4><p>' + x.why + '</p>';
    return el;
  }
  function streamSummary(text) {
    var box = $('#ai-summary');
    var cur = $('#ai-cursor');
    box.textContent = '';
    if (RM) { box.textContent = text; if (cur) cur.hidden = true; return; }
    if (cur) cur.hidden = false;
    var words = text.split(' '); var i = 0;
    box.classList.add('streaming');
    (function next() {
      if (i >= words.length) { box.classList.remove('streaming'); if (cur) cur.hidden = true; return; }
      box.textContent += (i ? ' ' : '') + words[i]; i++;
      setTimeout(next, 28 + Math.random() * 36);
    })();
  }

  /* restart */
  $$('[data-restart]').forEach(function (b) {
    b.addEventListener('click', function () { $('#url-input').value = STATE.url; go('url'); });
  });

  /* init: show only the first step */
  go('url');

  /* deep-link any hero CTA to the tool */
  $$('[data-start-audit]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      go('url');
      var i = $('#url-input'); if (i) { setTimeout(function () { i.focus(); }, RM ? 0 : 500); }
    });
  });
})();
