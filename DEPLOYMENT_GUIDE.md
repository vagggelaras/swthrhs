# Οδηγός Production Deployment — EnergyCompare

Βήμα-βήμα οδηγίες για να βγει online με custom domain.

---

## Προϋποθέσεις

- [x] Supabase project ενεργό (database, auth, storage, RLS)
- [x] GitHub repos με CI/CD (GitHub Actions)
- [x] Supabase keys στα GitHub Secrets
- [ ] Custom domain (π.χ. `energycompare.gr`)

---

## Βήμα 1 — Αγορά Domain

Αγόρασε ένα domain `.gr` ή `.com` από:
- **papaki.gr** / **tophost.gr** (για .gr domains, ~10 EUR/χρόνο)
- **namecheap.com** / **porkbun.com** (για .com/.eu, ~8-12 EUR/χρόνο)

Θα χρειαστείς **ένα domain** με subdomain για το Dashboard:
```
energycompare.gr       → Frontend (δημόσιο site)
admin.energycompare.gr → Dashboard (admin panel)
```

---

## Βήμα 2 — DNS Records

Στο DNS panel του registrar, πρόσθεσε:

### Για το root domain (`energycompare.gr`):
```
Τύπος    Όνομα    Τιμή                    TTL
A        @        185.199.108.153         3600
A        @        185.199.109.153         3600
A        @        185.199.110.153         3600
A        @        185.199.111.153         3600
CNAME    www      vagggelaras.github.io   3600
```

### Για το Dashboard subdomain (`admin.energycompare.gr`):
```
Τύπος    Όνομα    Τιμή                    TTL
CNAME    admin    vagggelaras.github.io   3600
```

> Τα 4 A records είναι τα official GitHub Pages IPs.
> Τα DNS records χρειάζονται μέχρι 24 ώρες για propagation (συνήθως 10-30 λεπτά).

---

## Βήμα 3 — CNAME αρχεία στο repo

### Frontend:
Δημιούργησε αρχείο `Frontend/public/CNAME`:
```
energycompare.gr
```

### Dashboard:
Το Dashboard τρέχει σε ξεχωριστό repo (`vagggelaras/SwthrhsDashboard`).
Δημιούργησε αρχείο `public/CNAME` εκεί:
```
admin.energycompare.gr
```

> Τα αρχεία CNAME πρέπει να είναι στο `public/` folder ώστε να αντιγράφονται στο `dist/` κατά το build.

---

## Βήμα 4 — Αλλαγή base path

Τώρα τα apps σερβίρονται σε subpath (`/swthrhs/`, `/SwthrhsDashboard/`). Με custom domain θα σερβίρονται στο root (`/`).

### Frontend — `Frontend/vite.config.js`:
Άλλαξε:
```js
base: '/swthrhs/'
```
σε:
```js
base: '/'
```

### Dashboard — `SwthrhsDashboard/vite.config.js`:
Άλλαξε:
```js
base: '/SwthrhsDashboard/'
```
σε:
```js
base: '/'
```

---

## Βήμα 5 — Ενημέρωση internal links & references

Αρχεία που αναφέρουν τα παλιά paths και χρειάζονται update:

### Frontend:
- `Frontend/index.html` — canonical URL, og:url, hreflang links, structured data URLs
  ```
  Αντικατέστησε: https://vagggelaras.github.io/swthrhs/
  Με:            https://energycompare.gr/
  ```

### SPA routing fallback:
Δημιούργησε `Frontend/public/404.html` (GitHub Pages SPA trick):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script>
    // GitHub Pages SPA redirect: sends all 404s to index.html
    sessionStorage.redirect = location.href;
    location.replace(location.origin);
  </script>
</head>
</html>
```

Και πρόσθεσε στην αρχή του `Frontend/src/main.jsx`:
```js
// Handle GitHub Pages SPA redirect
const redirect = sessionStorage.redirect;
if (redirect) {
  delete sessionStorage.redirect;
  // If needed, parse redirect URL for routing
}
```

> Αν δεν χρησιμοποιείς client-side routing (react-router), δεν χρειάζεται αυτό.

---

## Βήμα 6 — GitHub Pages Settings

### Για κάθε repo:
1. Πήγαινε **Settings → Pages**
2. Στο **Custom domain** βάλε:
   - Frontend repo: `energycompare.gr`
   - Dashboard repo: `admin.energycompare.gr`
3. Τσέκαρε **Enforce HTTPS** (θα ενεργοποιηθεί αφού γίνει DNS verification)
4. Περίμενε μέχρι να εμφανιστεί "Your site is published at https://energycompare.gr"

---

## Βήμα 7 — Supabase configuration

### Redirect URLs:
Supabase Auth → URL Configuration → πρόσθεσε:
```
https://energycompare.gr
https://admin.energycompare.gr
```

### CORS / Allowed Origins (αν χρειάζεται):
Supabase κάνει auto-handle τα CORS, αλλά αν χρειαστεί:
- Settings → API → Allowed Origins → πρόσθεσε τα νέα domains

---

## Βήμα 8 — Τελικός έλεγχος

Μετά το deploy, έλεγξε:

- [ ] `https://energycompare.gr` φορτώνει το Frontend
- [ ] `https://admin.energycompare.gr` φορτώνει το Dashboard login
- [ ] HTTPS λειτουργεί (λουκέτο στο browser)
- [ ] Supabase calls δουλεύουν (φόρτωση plans/providers)
- [ ] Login στο Dashboard λειτουργεί
- [ ] File upload λειτουργεί
- [ ] Form submission λειτουργεί (δοκίμασε πλήρη ροή)
- [ ] Realtime updates στο CustomersTab δουλεύουν
- [ ] `http://energycompare.gr` κάνει redirect σε `https://`
- [ ] `www.energycompare.gr` κάνει redirect σε `energycompare.gr`

---

## Κόστος

| Υπηρεσία | Κόστος |
|----------|--------|
| Domain (.gr) | ~10 EUR/χρόνο |
| GitHub Pages hosting | Δωρεάν |
| SSL/HTTPS (Let's Encrypt) | Δωρεάν |
| Supabase Free Plan | Δωρεάν |
| GitHub Actions CI/CD | Δωρεάν |
| **Σύνολο** | **~10 EUR/χρόνο** |

### Πότε χρειάζεται αναβάθμιση Supabase (25$/μήνα Pro):
- Database > 500MB
- Storage > 1GB
- Χρειάζεσαι daily backups
- > 50K monthly active users
- Χρειάζεσαι Edge Functions (π.χ. για rate limiting ή staff creation)

---

## Σειρά ενεργειών (TL;DR)

```
1. Αγόρασε domain
2. Στήσε DNS records (A + CNAME)
3. Πρόσθεσε CNAME αρχεία στα repos
4. Άλλαξε base: '/' στα vite configs
5. Update URLs στο index.html
6. Push → GitHub Actions κάνει auto-deploy
7. GitHub Pages Settings → Custom domain + HTTPS
8. Supabase → πρόσθεσε νέα domains στα redirect URLs
9. Έλεγξε ότι όλα δουλεύουν
```
