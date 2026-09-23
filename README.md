# DreamHome — AI-Powered Personalised Real-Estate Prototype

Interactive prototype demonstrating an AI-powered platform that turns natural-language home requirements into structured matches, explanations, alternatives, and a “Build My Dream Home” pathway.

## Stack

- Bun
- Vite
- React 19 + TypeScript
- Tailwind CSS
- shadcn/ui (Radix)
- React Router
- TanStack Query
- Lucide icons

## Getting started

```bash
# Install dependencies (if not already installed)
bun install

# Run development server
bun run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Prototype flows

1. **Find My Dream Home**  
   Landing → Describe (free text or guided) → Review structured requirements → Matched properties with % and explanations → Alternatives → Property detail → Enquire / Request inspection

2. **Build My Dream Home**  
   Landing → Requirements → Preliminary specification + indicative budget → Explore land & professionals → Request connection

3. **Browse** — Traditional search & filters  
4. **Saved** — Favourited properties

## Notes

- All AI parsing, matching scores and construction estimates are **simulated** for demonstration.
- No real backend, authentication or payments.
- Property data is realistic mock data focused on Lagos (Lekki, Ajah, Sangotedo, etc.).
- Cost figures are illustrative only and labelled as preliminary estimates.

## Project structure

```
src/
  components/   # UI, layout, property cards, etc.
  data/         # Mock properties, professionals, land
  lib/          # Matching logic, store, buildSpec
  pages/        # All routes
  types/        # TypeScript interfaces
```
