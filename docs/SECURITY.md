# Security Model (SECURITY)

## Threat Model
- **Prompt Injection**: Primary risk for AI-driven image synthesis.
- **Asset Exfiltration**: Risk during logo/background ingestion.
- **Dependency Vulnerabilities**: Frontend stack supply chain risks.

## Security Controls
- **Prompt Injection**: Handled by Gemini Safety Filters (SafetyError in `shared/utils/errors.ts`).
- **NHI (Non-Human Identity)**: `UNKNOWN`.
- **Egress Controls**: `UNKNOWN`.
- **Patch Policy**: `UNKNOWN`.
- **Incident Response**: `UNKNOWN`.
- **Kill Switch**: `UNKNOWN`.

---
**Provenance:**
- Source: code|standard
- Locator: shared/utils/errors.ts, services/ai-core.ts
- Confidence: MEDIUM
- Last Verified: 2024-05-24
