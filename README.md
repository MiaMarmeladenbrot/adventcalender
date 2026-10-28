# Wo ist der Schlitten?

Escape-Adventskalender für die Familie, Dezember 2026. Mobile first, kein Login: Jede Gruppe bekommt einen geheimen Link, jede Person wählt einen Spitznamen.

## Aufbau

- `content/` – die 24 Tage, Figuren und Tafel. Wird **nur** von den Server-Funktionen importiert, damit Rätsel und Lösungen nicht vor ihrem Tag im Browser landen.
- `api/` – Vercel-Edge-Funktionen. Sprechen mit Supabase über den Service-Role-Key.
  - `POST /api/join` – Spitzname in einer Gruppe anlegen oder wiederfinden
  - `GET /api/state` – eigener Fortschritt, Tafel, Hinweise, Stand der anderen
  - `GET /api/day` – Inhalt eines freigegebenen Tages, ohne Lösung
  - `POST /api/answer` – Antwort prüfen, Tag als gelöst speichern, Tafel streichen
  - `POST /api/hint` – nächsten Hinweis holen
  - `POST /api/mark` – Eintrag auf der Tafel streichen oder zurückholen
- `supabase/schema.sql` – Schema `adventskalender` im Lesestapel-Projekt. RLS an, keine Policies: Browser kommen nicht an die Tabellen, nur die API.
- `src/` – die App (noch das Vite-Gerüst).

Türen öffnen am jeweiligen Dezembertag um 6 Uhr Berliner Zeit. Mit dem Header `x-preview: <PREVIEW_TOKEN>` sind alle Türen offen.

## Einrichten

1. `supabase/schema.sql` im SQL-Editor des Lesestapel-Projekts ausführen.
2. Unter *Settings → API → Exposed schemas* `adventskalender` hinzufügen.
3. `.env.example` nach `.env` kopieren und ausfüllen.
4. Eine Gruppe anlegen:
   ```sql
   insert into adventskalender.families (name, join_code)
   values ('Familie', replace(gen_random_uuid()::text, '-', ''))
   returning join_code;
   ```
   Der Link für die Gruppe ist dann `https://<domain>/f/<join_code>`.

## Entwickeln

```sh
pnpm install
pnpm test
vercel dev
```

`pnpm dev` startet nur das Frontend. Die API läuft lokal über `vercel dev`.
