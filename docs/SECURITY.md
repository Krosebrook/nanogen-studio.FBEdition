# Security Model (SECURITY)

## Threat Model
- **Prompt Injection**: Primary risk for AI-driven image synthesis.
- **Asset Exfiltration**: Risk during logo/background ingestion.
- **Dependency Vulnerabilities**: Frontend stack supply chain risks.
- **API Key Exposure**: Risk of client-side API key being compromised.

## Security Controls
- **Prompt Injection**: Handled by Gemini Safety Filters (SafetyError in `shared/utils/errors.ts`). The application also implements a `normalizeError` function that specifically catches and handles safety violations, preventing further processing of harmful prompts.
- **NHI (Non-Human Identity)**: Managed via API Keys. The `AICoreService` retrieves the Google Gemini API key from environment variables. An `AuthenticationError` is thrown if the key is missing or invalid, preventing unauthorized access.
- **Egress Controls**: Direct connection to Google AI services via HTTPS. The application relies on the secure TLS channel provided by the `@google/genai` SDK for all outbound traffic. No other egress points are defined.
- **Patch Policy**: `UNKNOWN`.
- **Incident Response**: `UNKNOWN`.
- **Kill Switch**: The `AICoreService` implements a retry mechanism with exponential backoff. For non-transient errors, such as safety violations or authentication failures, the request is immediately terminated, acting as a per-request kill switch.

---
**Provenance:**
- Source: code|standard
- Locator: shared/utils/errors.ts, services/ai-core.ts
- Confidence: HIGH
- Last Verified: 2024-05-24
