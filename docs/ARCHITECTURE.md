# System Architecture (ARCHITECTURE)

## Overview
NanoGen Studio is a feature-based React application leveraging the Gemini API for high-fidelity image editing and product visualization.

## Modules
- **Editor**: Image manipulation and analysis (features/editor).
- **Merch**: Product mockup synthesis (features/merch).
- **Integrations**: Platform connectivity (features/integrations).
- **Services**: AI Orchestration layer (services/ai-core.ts).

## Data Flow
`Asset Upload` -> `Base64 Normalization` -> `Gemini API Request` -> `Candidate Parsing` -> `Canvas Rendering`

## Orchestration Pattern
- **Status**: UNKNOWN
- **Action Required**: Human Review to verify hook-based state machine vs service-level orchestration.

## Trust Boundaries
- **Browser-API Boundary**: Authentication via `process.env.API_KEY`.
- **LocalStorage Boundary**: Platform keys storage.

## Failure Modes
- **API Timeout**: Handled via `AbortController`.
- **Safety Block**: Handled via `SafetyError`.
- **Rate Limit**: Handled via exponential backoff in `services/ai-core.ts`.

---
**Provenance:**
- Source: code
- Locator: features/, services/ai-core.ts, shared/utils/errors.ts
- Confidence: HIGH
- Last Verified: 2024-05-24
