/* AEO Canon — Discovery Journey engine.
   The primary conversion mechanism: 8 questions, an insight after each,
   ending in a personalized AEO Readiness Score + recommendations.
   Generates semantic markup with .aeoj-* classes that each direction styles. */
(function () {
  var QUESTIONS = [
    {
      q: "What kind of business are you optimizing?",
      sub: "Different categories get surfaced very differently by AI search.",
      opts: ["HVAC / Home services", "Financial advisor", "Med spa / Aesthetics", "Dental practice", "Other local service"],
      insight: {
        t: "AI recommends a category before it recommends you.",
        b: "When someone asks an assistant for “a good HVAC company near me,” the model first decides which *kind* of business answers the question, then picks names it has seen described consistently. Most owners optimize their name. The winners optimize the category sentence."
      }
    },
    {
      q: "Do you know what ChatGPT says when asked to recommend a business like yours?",
      sub: "Be honest — most owners have never looked.",
      opts: ["I’ve checked recently", "I checked once, long ago", "I’ve never looked", "I didn’t know I could"],
      insight: {
        t: "If you’ve never read your own AI answer, you’re optimizing blind.",
        b: "The answer an engine gives is your real storefront now. It’s often wrong, outdated, or recommending a competitor — and it changes weekly. Reading it is free, takes 90 seconds, and is the single highest-leverage thing most businesses aren’t doing."
      }
    },
    {
      q: "Does your website use structured data (schema markup)?",
      sub: "The machine-readable layer most sites skip.",
      opts: ["Yes, fully implemented", "Partially / not sure", "No", "What is schema?"],
      insight: {
        t: "Schema is how you talk to a machine in its own language.",
        b: "Answer engines parse structured data to understand services, areas served, hours, pricing, and credentials with confidence. Without it, the model is guessing from your prose — and a guessing model defaults to the competitor whose data is unambiguous."
      }
    },
    {
      q: "How often do you publish content that answers a customer’s actual question?",
      sub: "Not blog posts about your company — answers to real queries.",
      opts: ["Weekly", "Monthly", "Rarely", "Never"],
      insight: {
        t: "Question-shaped content is the raw material AI cites.",
        b: "Engines assemble answers from sources that already answer the question cleanly. “Why is my heat pump freezing up?” earns citations. “Welcome to our blog” earns nothing. The canon is built one answered question at a time."
      }
    },
    {
      q: "Is your Google Business Profile complete and current?",
      sub: "Still a primary signal feeding AI local results.",
      opts: ["Fully optimized", "Mostly there", "Neglected", "Don’t have one"],
      insight: {
        t: "Local AI answers lean hard on the profiles you control.",
        b: "Hours, categories, service areas, and Q&A on your profile flow directly into how assistants describe you. A thin profile doesn’t just hurt maps — it starves the model of the facts it needs to recommend you with confidence."
      }
    },
    {
      q: "Are you described consistently across third-party sites?",
      sub: "Directories, reviews, local press, partner pages.",
      opts: ["Yes, very consistent", "Somewhat", "Inconsistent", "Barely present"],
      insight: {
        t: "AI triangulates. One source is a claim; five agreeing sources is a fact.",
        b: "Models trust what multiple independent places say about you. When your name, services, and specialty are described the same way across the web, you become a fact the engine will repeat. Contradictions make you a risk it avoids."
      }
    },
    {
      q: "Does your site answer questions plainly, or sell with marketing language?",
      sub: "Read your homepage out loud. Is it an answer or an ad?",
      opts: ["Plain, direct answers", "A mix", "Mostly marketing", "Heavy marketing"],
      insight: {
        t: "Engines extract answers, not adjectives.",
        b: "“Industry-leading, premium, trusted” is invisible to a model — it can’t cite a superlative. Clear, specific, extractable sentences (“We service ductless mini-splits across Travis County, same-day”) are what get lifted into an answer verbatim."
      }
    },
    {
      q: "Have you tested your visibility across more than one AI engine?",
      sub: "ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot.",
      opts: ["Yes, several", "One or two", "Just one", "None"],
      insight: {
        t: "There is no single ranking anymore — there are many, and they disagree.",
        b: "You might be the top recommendation in Perplexity and absent from AI Overviews. Each engine weighs sources differently. Visibility is now a portfolio you monitor, not a position you hold."
      }
    }
  ];

  function scoreFromAnswers(answers) {
    // Earlier options = stronger; weight toward a believable mid score.
    var pts = 0, max = 0;
    answers.forEach(function (idx, i) {
      if (i === 0) return; // category question isn't scored
      var n = QUESTIONS[i].opts.length;
      max += 100;
      pts += Math.round((1 - (idx / (n - 1))) * 100);
    });
    return Math.round((pts / max) * 100);
  }

  function band(score) {
    if (score >= 75) return { label: "Established", note: "You’re ahead of most. The work now is defending and compounding your visibility." };
    if (score >= 50) return { label: "Emerging", note: "Real foundations, real gaps. A focused 90-day push would move you into the top tier of your category." };
    if (score >= 25) return { label: "At Risk", note: "Competitors with weaker businesses are being recommended over you right now. This is fixable — quickly." };
    return { label: "Invisible", note: "AI engines currently can’t describe or recommend you with confidence. The upside here is enormous." };
  }

  function recsFor(answers) {
    var r = [];
    if (answers[2] >= 1) r.push("Implement complete service & local-business schema across every page.");
    if (answers[3] >= 2) r.push("Stand up a question-first content engine — start with your 20 highest-intent queries.");
    if (answers[4] >= 2) r.push("Rebuild your Google Business Profile into a fact-dense source the models can trust.");
    if (answers[5] >= 2) r.push("Run a citation-consistency sweep across directories, reviews, and partner sites.");
    if (answers[6] >= 1) r.push("Rewrite key pages from marketing language into extractable, answer-shaped copy.");
    if (answers[7] >= 1) r.push("Set up monthly visibility monitoring across ChatGPT, Perplexity, and AI Overviews.");
    while (r.length < 3) r.push("Book a canon review to map your category’s answer landscape.");
    return r.slice(0, 4);
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  window.AEOJourney = {
    questions: QUESTIONS,
    mount: function (root, opts) {
      opts = opts || {};
      var answers = [];
      var step = 0; // 0..n questions, then insight states handled inline

      function render() {
        root.innerHTML = '';
        var total = QUESTIONS.length;
        // progress
        var prog = el('div', 'aeoj-progress');
        prog.innerHTML = '<div class="aeoj-progress__bar" style="width:' +
          (answers.length / total * 100) + '%"></div>';
        var meta = el('div', 'aeoj-meta',
          '<span class="aeoj-step">' + String(Math.min(answers.length + 1, total)).padStart(2, '0') +
          ' / ' + String(total).padStart(2, '0') + '</span><span class="aeoj-meta__label">AEO Readiness</span>');

        if (answers.length < total) {
          var Q = QUESTIONS[answers.length];
          var card = el('div', 'aeoj-card aeoj-card--q');
          card.appendChild(meta);
          card.appendChild(prog);
          card.appendChild(el('h3', 'aeoj-q', Q.q));
          card.appendChild(el('p', 'aeoj-sub', Q.sub));
          var optsWrap = el('div', 'aeoj-opts');
          Q.opts.forEach(function (o, i) {
            var b = el('button', 'aeoj-opt', '<span>' + o + '</span>');
            b.addEventListener('click', function () {
              answers.push(i);
              renderInsight();
            });
            optsWrap.appendChild(b);
          });
          card.appendChild(optsWrap);
          root.appendChild(card);
        } else {
          renderResult();
        }
      }

      function renderInsight() {
        root.innerHTML = '';
        var Q = QUESTIONS[answers.length - 1];
        var card = el('div', 'aeoj-card aeoj-card--insight');
        card.appendChild(el('div', 'aeoj-insight__tag', 'What most people don’t realize'));
        card.appendChild(el('h3', 'aeoj-insight__title', Q.insight.t));
        card.appendChild(el('p', 'aeoj-insight__body', Q.insight.b));
        var next = el('button', 'aeoj-next',
          answers.length >= QUESTIONS.length ? 'See my readiness score →' : 'Continue →');
        next.addEventListener('click', render);
        card.appendChild(next);
        root.appendChild(card);
        if (opts.onInsight) opts.onInsight(answers.length);
      }

      function renderResult() {
        root.innerHTML = '';
        var score = scoreFromAnswers(answers);
        var b = band(score);
        var recs = recsFor(answers);
        var card = el('div', 'aeoj-card aeoj-card--result');
        card.appendChild(el('div', 'aeoj-insight__tag', 'Your AEO Readiness'));
        var ring = el('div', 'aeoj-score');
        ring.innerHTML = '<div class="aeoj-score__num">' + score + '</div>' +
          '<div class="aeoj-score__of">/ 100</div>';
        card.appendChild(ring);
        card.appendChild(el('div', 'aeoj-band', b.label));
        card.appendChild(el('p', 'aeoj-sub', b.note));
        var list = el('ul', 'aeoj-recs');
        recs.forEach(function (r, i) {
          list.appendChild(el('li', 'aeoj-rec', '<span class="aeoj-rec__n">' +
            String(i + 1).padStart(2, '0') + '</span><span>' + r + '</span>'));
        });
        card.appendChild(el('h4', 'aeoj-recs__title', 'Your prioritized next moves'));
        card.appendChild(list);
        var cta = el('div', 'aeoj-cta');
        cta.innerHTML = '<button class="aeoj-cta__primary">Get my custom AEO plan</button>' +
          '<button class="aeoj-cta__ghost" data-restart>Retake the assessment</button>';
        cta.querySelector('[data-restart]').addEventListener('click', function () {
          answers = []; render();
        });
        card.appendChild(cta);
        root.appendChild(card);
        if (opts.onResult) opts.onResult(score);
      }

      render();
    }
  };
})();
