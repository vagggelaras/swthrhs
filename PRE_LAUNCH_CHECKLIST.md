# Pre-Launch Checklist

## Κρίσιμα (πριν ανοίξει στο κοινό)

- [ ] **Αφαίρεση noindex** — `robots.txt` και meta tag στο Frontend εμποδίζουν τα Google crawlers
  - `Frontend/public/robots.txt` → αφαίρεσε `Disallow: /`
  - `Frontend/index.html` → αφαίρεσε `<meta name="robots" content="noindex,nofollow">`

- [ ] **CSP headers** — Content-Security-Policy meta tag και στα δύο `index.html`
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #4

## Security (πρώτη εβδομάδα μετά launch)

- [ ] **Idle session timeout** — auto-logout dashboard μετά 30 λεπτά αδράνειας
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #11c

- [ ] **Αφαίρεση PII από sessionStorage** — submissions να μην cache-άρονται
  - `SwthrhsDashboard/src/components/CustomersTab.jsx` → αφαίρεσε `cacheSet(CACHE_KEY, data)`
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #10

- [ ] **Password complexity** — 10+ χαρακτήρες, κεφαλαίο, πεζό, αριθμός
  - `SwthrhsDashboard/src/components/AppSettingsTab.jsx`
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #11b

- [ ] **SRI hash στο FontAwesome CSS** — Dashboard `index.html`
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #11

- [ ] **Audit log policy** — restrict INSERT σε own user_id
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #9

## Nice-to-have

- [ ] **Logos στο Supabase Storage** — αν προστεθούν logos, να αποθηκεύονται ως αρχεία
  - Λεπτομέρειες στο `LOGOS_MIGRATION_PLAN.md`

- [ ] **DOMPurify** αντί για custom SVG sanitization
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #7

- [ ] **Edge Function για staff creation** αντί για `signUp()`
  - Λεπτομέρειες στο `PRE_PRODUCTION_AUDIT.md` → issue #6
