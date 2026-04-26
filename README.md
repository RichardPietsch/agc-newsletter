# AGC Newsletter Builder (MVP)

Initial MVP for the Anglo-German Club office to compose monthly newsletters with reusable modules, secure login, and HTML export.

## Why these initial modules

Based on the club communication needs (event invitations, formal tone, practical details) and visual direction inferred from the Anglo-German Club website (traditional, elegant, navy/burgundy palette), the minimal starter module set is:

1. **Hero Banner** – monthly intro and visual opener
2. **Event Card** – repeatable event teasers with registration links
3. **Two Column Content** – balanced story/update layout
4. **Chairman/Office Quote** – formal editorial voice
5. **Call-to-Action block** – strong RSVP actions
6. **Practical Info List** – dress code, timings, contact details

This keeps creation simple while covering >90% of recurring member communication patterns.

## Implemented in this step

- Next.js + Tailwind app scaffold
- Secure login via NextAuth credentials
- Postgres persistence via Prisma
- Newsletter list/create flow
- Newsletter editor with module catalog and ordering
- Fixed header/footer in exported HTML
- Dockerized local deployment (`web` + `postgres`)
- Seed user for immediate local testing

## Local test deployment (Docker)

```bash
docker compose up --build
```

Open: [http://localhost:3000](http://localhost:3000)

Default local login:

- Email: `office@anglogermanclub.de`
- Password: `ChangeMe123!`

> Change the seeded password and `NEXTAUTH_SECRET` before production use.

## Architecture notes

- `app/(auth)/login` – sign-in page
- `app/(app)/dashboard` – authenticated workspace
- `app/api/newsletters/*` – create/update/module endpoints
- `app/api/export/[id]` – download HTML for email tool import
- `lib/modules.ts` – module catalog and defaults
- `lib/html-export.ts` – newsletter-safe HTML generator

## Next recommended iteration

- True drag-and-drop interaction
- Image upload to local object storage (S3-compatible)
- Rich text controls and stricter link validation
- Role-based users (office staff / admin)
- Versioning + preview emails
