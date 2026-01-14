# Documentation Governance Policy (DOC_POLICY)

## 1. Scope
This policy governs all documentation within this repository, specifically targeting technical accuracy, structural integrity, and provenance.

Required core documentation includes:
- `docs/DOC_POLICY.md`: This authority document.
- `docs/SECURITY.md`: Threat models and security protocols.
- `docs/ARCHITECTURE.md`: High-level system design and data flow.
- `docs/FRAMEWORK.md`: Tech stack and CI/CD integration.
- `docs/CHANGELOG.md`: Version history and baseline establishment.
- `docs/AGENTS_DOCUMENTATION_AUTHORITY.md`: System prompt for automated documentation agents.
- `llms.txt`: Discovery index for LLM-based agents.

## 2. Authority Model
- **Human Authority**: Core architectural decisions and policy changes.
- **Documentation Authority Agent (DAA)**: Automated maintenance of cross-references, `llms-full.txt` generation, and incremental doc updates.

## 3. Provenance and Evidence-Bound Rules
Every section added or modified must include a provenance footer:
- **Source**: `code` | `config` | `git` | `standard`
- **Locator**: File paths or commit SHAs providing the evidence.
- **Confidence**: `HIGH` | `MEDIUM` | `LOW`
- **Last Verified**: YYYY-MM-DD

**Fail-Closed Rule**: If confidence is `LOW` or evidence is missing, mark the block as `UNKNOWN` and stop the change. No guessing is permitted.

## 4. Maintenance Rules
- **Incremental-Only**: Documentation is additive. Rewrites are prohibited unless `DOC_REWRITE_APPROVED=true`.
- **ADR Governance**: Architectural Decision Records (ADR) are append-only. New decisions must supersede old ones via a new ADR entry.
- **CI Enforcement**: The Documentation Authority CI workflow validates required files and rebuilds indices on every PR.

## 5. Automation Kill-Switch
Auto-commits by the DAA are disabled by default. 
- **Variable**: `DOC_AUTOMATION_ENABLED=true` must be set in the environment to allow automated commits to `llms-full.txt`.

---
**Provenance:**
- Source: standard
- Locator: docs/DOC_POLICY.md (Initial Baseline)
- Confidence: HIGH
- Last Verified: 2024-05-24
