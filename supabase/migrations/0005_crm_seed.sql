-- Starter CRM data: the tags, segments, templates, and the two funnel campaigns
-- (a course drip for learners and a website/sales drip for prospects) that make
-- the automation engine useful on day one. Fully idempotent (ON CONFLICT DO
-- NOTHING) — safe to re-run. Claude edits/extends these rows to change the funnel;
-- see ADMIN_CRM.md for the authoring runbook.
--
-- Email bodies use {{variables}} interpolated at send time by src/lib/email/
-- render.ts. Available: {{first_name}}, {{email}}, {{site_url}}, {{unsubscribe_url}}.
-- The base layout auto-appends an unsubscribe footer, so bodies don't include one.

-- ── Tags ─────────────────────────────────────────────────────────────────────
insert into public.tags (name, color) values
  ('scorecard',        '#7c3aed'),
  ('contact-form',     '#2563eb'),
  ('website-interest', '#db2777'),
  ('dfy-interest',     '#059669'),
  ('course-learner',   '#d97706')
on conflict (lower(name)) do nothing;

-- ── Segments ─────────────────────────────────────────────────────────────────
-- Dynamic segments are resolved from `definition` at query time (see
-- src/lib/crm/segments.ts). Rule shape: { "all"|"any": [ {field, op, value} ] }.
insert into public.segments (key, name, description, kind, definition) values
  ('all-subscribers', 'All subscribers',
   'Every contact who has not unsubscribed. Default broadcast audience.',
   'dynamic', '{"all":[{"field":"unsubscribed_all","op":"eq","value":false}]}'::jsonb),
  ('scorecard-leads', 'Scorecard leads',
   'Contacts captured through the 8-pillar scorecard.',
   'dynamic', '{"all":[{"field":"source","op":"eq","value":"scorecard"}]}'::jsonb),
  ('contact-inquiries', 'Contact inquiries',
   'Contacts who reached out through the contact form.',
   'dynamic', '{"all":[{"field":"source","op":"eq","value":"contact_form"}]}'::jsonb),
  ('website-prospects', 'Website prospects',
   'Contacts interested in a website rebuild / done-for-you work.',
   'dynamic', '{"any":[{"field":"tag","op":"has","value":"website-interest"},{"field":"tag","op":"has","value":"dfy-interest"}]}'::jsonb),
  ('customers', 'Customers',
   'Contacts marked as customers.',
   'dynamic', '{"all":[{"field":"stage","op":"eq","value":"customer"}]}'::jsonb)
on conflict (key) do nothing;

-- ── Standalone templates (for broadcasts / reuse) ────────────────────────────
insert into public.email_templates (key, name, subject, html, text, description) values
  ('broadcast-blank', 'Blank broadcast',
   '{{subject}}',
   '<p>Hi {{first_name}},</p>{{body}}',
   'Hi {{first_name}},\n\n{{body}}',
   'Minimal shell for ad-hoc broadcasts authored in the dashboard.')
on conflict (key) do nothing;

-- ── Campaign 1: AEO Foundations course drip ──────────────────────────────────
insert into public.campaigns (key, name, description, type, status, segment_id)
select 'course-aeo-foundations',
       'AEO Foundations course drip',
       'Welcomes learners and walks them through the AEO Foundations course over a week, ending on a soft consult CTA.',
       'drip', 'active',
       (select id from public.segments where key = 'scorecard-leads')
on conflict (key) do nothing;

insert into public.campaign_steps (campaign_id, step_order, send_after_minutes, subject, html, text)
select c.id, v.step_order, v.send_after_minutes, v.subject, v.html, v.text
from public.campaigns c
join (values
  (0, 0,
   'Welcome to AEO Foundations',
   '<p>Hi {{first_name}},</p><p>Welcome — you just took the first step toward being the source AI engines actually cite.</p><p><strong>Start here:</strong> the free <a href="{{site_url}}/courses/aeo-foundations">AEO Foundations</a> course. Six short lessons take you from "what is AEO" to writing passages AI will quote.</p><p>I''ll send a nudge every couple of days so it''s easy to finish. Reply any time — I read every message.</p><p>— Burke, AEO Canon</p>',
   'Hi {{first_name}},\n\nWelcome — you just took the first step toward being the source AI engines actually cite.\n\nStart here: the free AEO Foundations course at {{site_url}}/courses/aeo-foundations. Six short lessons take you from "what is AEO" to writing passages AI will quote.\n\nI''ll send a nudge every couple of days so it''s easy to finish. Reply any time.\n\n— Burke, AEO Canon'),
  (1, 2880,
   'How AI engines actually choose what to cite',
   '<p>Hi {{first_name}},</p><p>Ranking #1 doesn''t guarantee a citation. Engines run a <em>retrieve → rerank → cite</em> pipeline, and a cleaner, better-evidenced passage can win over the top result.</p><p>Lesson 2 breaks it down: <a href="{{site_url}}/courses/aeo-foundations/how-engines-cite">How AI Engines Choose What to Cite</a>.</p><p>— Burke</p>',
   'Hi {{first_name}},\n\nRanking #1 doesn''t guarantee a citation. Engines run a retrieve → rerank → cite pipeline, and a cleaner, better-evidenced passage can win over the top result.\n\nLesson 2: {{site_url}}/courses/aeo-foundations/how-engines-cite\n\n— Burke'),
  (2, 5760,
   'The move that most improves your odds of being cited',
   '<p>Hi {{first_name}},</p><p>It''s not more keywords — it''s <strong>answer-first, evidenced passages</strong>. Lead with the answer, keep it self-contained, back it with a specific stat or source.</p><p>Lesson 4 is the craft: <a href="{{site_url}}/courses/aeo-foundations/extractability">Writing Passages AI Will Quote</a>.</p><p>— Burke</p>',
   'Hi {{first_name}},\n\nIt''s not more keywords — it''s answer-first, evidenced passages. Lead with the answer, keep it self-contained, back it with a specific stat or source.\n\nLesson 4: {{site_url}}/courses/aeo-foundations/extractability\n\n— Burke'),
  (3, 10080,
   'Want a second set of eyes on your AI visibility?',
   '<p>Hi {{first_name}},</p><p>By now you''ve seen the whole Canon — Access through Adaptability. If you''d like a hand applying it to your own site, I''d be glad to take a look.</p><p><a href="{{site_url}}/contact">Book a quick call</a> and we''ll walk through where AI puts your business today and the highest-leverage fixes.</p><p>— Burke, AEO Canon</p>',
   'Hi {{first_name}},\n\nBy now you''ve seen the whole Canon — Access through Adaptability. If you''d like a hand applying it to your own site, I''d be glad to take a look.\n\nBook a quick call: {{site_url}}/contact\n\n— Burke, AEO Canon')
) as v(step_order, send_after_minutes, subject, html, text) on true
where c.key = 'course-aeo-foundations'
on conflict (campaign_id, step_order) do nothing;

-- ── Campaign 2: Website / done-for-you sales drip ────────────────────────────
insert into public.campaigns (key, name, description, type, status, segment_id)
select 'sales-website',
       'Website / done-for-you sales drip',
       'For prospects interested in a website rebuild or done-for-you AEO. Builds the case for an AEO-native site and ends on a booking CTA.',
       'drip', 'active',
       (select id from public.segments where key = 'website-prospects')
on conflict (key) do nothing;

insert into public.campaign_steps (campaign_id, step_order, send_after_minutes, subject, html, text)
select c.id, v.step_order, v.send_after_minutes, v.subject, v.html, v.text
from public.campaigns c
join (values
  (0, 0,
   'Your website, built to be cited by AI',
   '<p>Hi {{first_name}},</p><p>Thanks for your interest. Most sites are built to rank in a list of links — but AI answer engines cite <em>passages</em>, and they mostly don''t run JavaScript. That changes how a site should be built.</p><p>Over the next few days I''ll share how we build sites that get quoted, not just ranked. Curious now? <a href="{{site_url}}/contact">Grab a time to talk</a>.</p><p>— Burke, AEO Canon</p>',
   'Hi {{first_name}},\n\nThanks for your interest. Most sites are built to rank in a list of links — but AI answer engines cite passages, and they mostly don''t run JavaScript. That changes how a site should be built.\n\nOver the next few days I''ll share how we build sites that get quoted, not just ranked. Curious now? {{site_url}}/contact\n\n— Burke, AEO Canon'),
  (1, 2880,
   'Why "SEO-friendly" isn''t "AI-citable"',
   '<p>Hi {{first_name}},</p><p>Vercel and MERJ found AI crawlers execute essentially <strong>no JavaScript</strong> across 500M+ requests. If your content is client-rendered, engines never see it — so it can never be cited.</p><p>An AEO-native rebuild puts the answer in the HTML, fast, on every page. <a href="{{site_url}}/contact">Want to see what that looks like for your site?</a></p><p>— Burke</p>',
   'Hi {{first_name}},\n\nVercel and MERJ found AI crawlers execute essentially no JavaScript across 500M+ requests. If your content is client-rendered, engines never see it — so it can never be cited.\n\nAn AEO-native rebuild puts the answer in the HTML, fast, on every page. Want to see what that looks like for your site? {{site_url}}/contact\n\n— Burke'),
  (2, 7200,
   'Ready when you are',
   '<p>Hi {{first_name}},</p><p>If a site that AI engines actually cite sounds worth exploring, the fastest next step is a short call — I''ll show you where you stand today and exactly what a rebuild would change.</p><p><a href="{{site_url}}/contact">Book a call</a>. No pressure either way.</p><p>— Burke, AEO Canon</p>',
   'Hi {{first_name}},\n\nIf a site that AI engines actually cite sounds worth exploring, the fastest next step is a short call — I''ll show you where you stand today and exactly what a rebuild would change.\n\nBook a call: {{site_url}}/contact. No pressure either way.\n\n— Burke, AEO Canon')
) as v(step_order, send_after_minutes, subject, html, text) on true
where c.key = 'sales-website'
on conflict (campaign_id, step_order) do nothing;
