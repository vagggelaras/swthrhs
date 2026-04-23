# Demo Mode — Αλλαγές

## Νέα αρχεία

| Αρχείο | Περιγραφή |
|--------|-----------|
| `demo_mode_setup.sql` | SQL για Supabase: νέος πίνακας demo_sessions, νέες στήλες, RLS policies, pg_cron cleanup |
| `edge-functions/create-demo-user.ts` | Edge Function: δημιουργία real auth user με expiry για temp staff |
| `SwthrhsDashboard/src/lib/demoSession.js` | Utility: διαχείριση demo session UUID στο localStorage |

## Τροποποιημένα αρχεία

| Αρχείο | Αλλαγές |
|--------|---------|
| `SwthrhsDashboard/src/App.jsx` | Bypass login gate, demo mode state, countdown timer, demo badge στο sidebar, "Σύνδεση Staff" button για anon users |
| `SwthrhsDashboard/src/App.css` | Styles για demo badge, demo-record-badge, demo-readonly-notice, demo-role-badge |
| `SwthrhsDashboard/src/components/LoginPage.jsx` | Prop `onCancel` — εμφανίζει "← Πίσω στο Demo" button |
| `SwthrhsDashboard/src/components/LoginPage.css` | Style για `.login-back-btn` |
| `SwthrhsDashboard/src/components/ProvidersTab.jsx` | Demo filter στο fetch, demo fields στο insert, guard στο edit/delete/toggleGas, "Demo" badges, disabled buttons για real records |
| `SwthrhsDashboard/src/components/PlansTab.jsx` | Demo filter στο fetch, demo fields στο insert, guard στο edit/delete, "Demo" badges, disabled buttons για real records, fetchProviders σε demo mode φέρνει όλους τους providers |
| `SwthrhsDashboard/src/components/PlansByCategoryTab.jsx` | Demo filter στο fetch, guard στο saveEdit/handleDelete, disabled buttons για real records, demoMode/demoSessionId props στο CategoryTable |
| `SwthrhsDashboard/src/components/AppSettingsTab.jsx` | createUser σε demo mode καλεί Edge Function αντί για signUp, "Demo" badge σε temp staff entries |
| `SwthrhsDashboard/src/components/SettingsTab.jsx` | Read-only σε demo mode: κρυφά τα buttons save/delete/add, notice banner |
| `SwthrhsDashboard/src/components/StatusSettingsTab.jsx` | Read-only σε demo mode: κρυφά τα buttons edit/delete/lock/add, notice banner |
| `SwthrhsDashboard/src/components/CustomersTab.jsx` | Σε demo mode εμφανίζει "δεδομένα πελατών μη διαθέσιμα" αντί για real data |
| `Frontend/src/App.jsx` | `.is('demo_session_id', null)` στα queries providers και plans — αποκλεισμός demo records από τη δημόσια σελίδα |

## Database αλλαγές (demo_mode_setup.sql)

- Νέος πίνακας `demo_sessions(id, created_at, expires_at)`
- Νέες στήλες σε `providers`, `plans`, `staff`: `demo_session_id UUID FK → demo_sessions ON DELETE CASCADE`, `expires_at TIMESTAMPTZ`
- Updated SELECT policies σε providers/plans: φιλτράρισμα expired demo records
- Νέες anon policies: INSERT/UPDATE/DELETE σε providers και plans (μόνο demo records)
- Νέα policy: anon SELECT σε staff (για AppSettings)
- pg_cron job: `DELETE FROM demo_sessions WHERE expires_at < NOW()` κάθε ώρα → cascade σε providers/plans/staff

## Τι πρέπει να κάνεις στο Supabase

1. **SQL Editor** → τρέξε `demo_mode_setup.sql` (Βήμα 1)
2. **Database → Extensions** → ενεργοποίησε `pg_cron`
3. **SQL Editor** → τρέξε το Βήμα 2 του `demo_mode_setup.sql` (το cron.schedule)
4. **Edge Functions → New Function** → όνομα: `create-demo-user` → paste κώδικα από `edge-functions/create-demo-user.ts`

## Λογική demo mode

```
Ανώνυμος χρήστης
  → demo session UUID στο localStorage
  → βλέπει real data + δικά του demo records
  → INSERT/UPDATE/DELETE μόνο σε demo records
  → Settings/StatusSettings: read-only
  → Customers: μη διαθέσιμο

Temp staff (δημιουργήθηκε από demo user)
  → real Supabase auth account με demo_session_id στο user_metadata
  → ίδια συμπεριφορά με ανώνυμο demo user
  → μετά 24ω: ο λογαριασμός δεν έχει πρόσβαση (staff record cascade-deleted)

Κανονικός staff (χωρίς demo metadata)
  → κανονική λειτουργία, μόνιμες αλλαγές

Cleanup (αυτόματο)
  → pg_cron κάθε ώρα: DELETE FROM demo_sessions WHERE expires_at < NOW()
  → cascade: σβήνει providers/plans/staff με demo_session_id
  → expired auth users: σβήνονται lazy στο επόμενο create-demo-user call
```
