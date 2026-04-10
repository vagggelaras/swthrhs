# Plan: Migrate Provider Logos to Supabase Storage

## Γιατί
Τα logos αποθηκεύονται ως base64 SVG strings μέσα στη βάση (`providers.logo_url`).
Αυτό σημαίνει ότι κάθε API request επιστρέφει τα bytes ολόκληρου του logo για κάθε πάροχο.
Με 30 ταυτόχρονους χρήστες: 1.2 GB data σε 3.5 λεπτά.

Η λύση: τα logos γίνονται αρχεία σε Supabase Storage με public URL.
Το browser τα cache-άρει → κατεβαίνουν μία φορά ανά χρήστη, ποτέ ξανά.

---

## Βήματα

### [ ] Step 1 — Supabase: Δημιουργία public bucket (MANUAL)
- Πήγαινε στο Supabase Dashboard → Storage
- Δημιούργησε νέο bucket με όνομα `logos`
- Τσέκαρε **"Public bucket"** (public read, no auth needed)
- Τρέξε στο SQL Editor:

```sql
-- Allow public read
CREATE POLICY "Public logo read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- Allow authenticated staff to upload/update/delete
CREATE POLICY "Staff logo upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Staff logo update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Staff logo delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos');
```

---

### [ ] Step 2 — Migration script: base64 → Storage (ONE-TIME)
Αρχείο: `scripts/migrate-logos.mjs`

Κάνει:
1. Φέρνει όλους τους παρόχους με `logo_url` που αρχίζει από `data:`
2. Decode base64 → SVG bytes
3. Upload στο Storage ως `{provider_id}.svg`
4. Update `providers.logo_url` με το νέο public URL

Τρέχει μία φορά: `node scripts/migrate-logos.mjs`

---

### [ ] Step 3 — Dashboard ProvidersTab: αλλαγή upload logic
Αρχείο: `SwthrhsDashboard/src/components/ProvidersTab.jsx`

- Αφαίρεση `svgToDataUri()` / `dataUriToSvg()` functions
- Νέα function `uploadLogoToStorage(svgText, providerId)`:
  - Δημιουργεί Blob από SVG text
  - Upload στο Storage ως `{providerId}.svg`
  - Επιστρέφει το public URL
- `handleAdd`: μετά το insert, αν υπάρχει SVG → upload → update logo_url
- `saveEdit`: αν άλλαξε το SVG → upload νέο → update logo_url
- Preview: χρησιμοποιεί URL αντί για data URI (λειτουργεί ίδια)

---

### [ ] Step 4 — Frontend: καμία ουσιαστική αλλαγή
Αρχείο: `Frontend/src/App.jsx`

- Το `logo_url` είναι πλέον μικρό URL string (~80 chars) αντί για base64 (~50KB+)
- Το `<img src={provider_logo}>` λειτουργεί ίδια
- Browser cache handles the rest

---

### [ ] Step 5 — Stress test επαλήθευση
- Τρέξε ξανά `k6 run stress-test.js`
- Αναμενόμενο: `data_received` < 50 MB (από 1.2 GB)
- Αναμενόμενο: `data_load_ms p(95)` < 1s

---

## Σειρά εκτέλεσης
1. Step 1 (Supabase bucket) — εσύ, manual
2. Step 2 (migration script) — Claude γράφει, εσύ τρέχεις
3. Step 3 (Dashboard) — Claude
4. Step 4 (Frontend) — Claude (ελάχιστες αλλαγές)
5. Step 5 (verify) — εσύ

## Εκτιμώμενο αποτέλεσμα
| Μετρική | Πριν | Μετά |
|---------|------|------|
| data_received (stress) | 1.2 GB | ~30-50 MB |
| data_load_ms p(95) | 18.97s | < 2s |
| Logo delivery | DB query | CDN + browser cache |
