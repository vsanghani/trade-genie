# Changelog

## 2026-04-13

- Hardened `src/app/api/webhook/route.ts` to use Stripe signature verification with raw request body parsing in production-style flows.
- Added strict rejection for unsigned webhook requests outside development.
- Kept a development-only fallback path for existing mock `lead` webhook payloads so local UI testing still works.
