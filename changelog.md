# Changelog

## 2026-04-13

- Fixed production lint blockers by replacing `any` with `unknown` in report/review API route error handlers.
- Updated internal home navigation in `src/app/services/[slug]/page.tsx` and `src/components/Navbar.tsx` to use Next.js `Link` instead of raw `<a href="/">`.
- Resolved React lint issues in UI components by removing an unused import, dropping an unused checkout response variable, and escaping unescaped quote/apostrophe characters in JSX text.
- Hardened `src/app/api/webhook/route.ts` to use Stripe signature verification with raw request body parsing in production-style flows.
- Added strict rejection for unsigned webhook requests outside development.
- Kept a development-only fallback path for existing mock `lead` webhook payloads so local UI testing still works.
- Replaced mock Stripe payment flow in `src/app/api/checkout/route.ts` with real Checkout Session creation and returned hosted Stripe checkout URLs.
- Replaced mock Stripe subscription flow in `src/app/api/subscribe/route.ts` with real subscription session creation using plan/cycle-specific Stripe Price IDs from environment variables.
- Added server-side validation for missing request origin and missing Stripe Price ID configuration in subscription checkout flow.
