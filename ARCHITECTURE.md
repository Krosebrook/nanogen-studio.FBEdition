# Architecture & Design Patterns

NanoGen Studio is an **AI-First UX** application designed for speed, high-fidelity synthesis, and professional-grade product visualization.

## 1. Feature-Driven Structure

The codebase is organized into domain-specific modules to maximize maintainability and reduce cross-feature leakage.

```
src/
├── features/               # High-level domain logic
│   ├── editor/             # Image manipulation & analysis
│   ├── merch/              # Product mockup synthesis
│   └── integrations/       # External connectivity tools
├── shared/                 # Core cross-feature primitives
│   ├── components/ui/      # Atomic Design System
│   ├── hooks/              # Global state & effects
│   └── utils/              # Pure functions (Canvas, File, Image)
└── services/               # Infrastructure Layer
    └── ai-core.ts          # Central Gemini API Service (SDK v1.30+)
```

## 2. Layout Strategy: CSS Grid & Clamping

We utilize **CSS Grid** as the primary layout engine to handle complex, multi-pane workspaces.

- **Deterministic Widths**: The Merch Studio sidebar uses a `clamp(340px, 30%, 420px)` configuration. This ensures that on large screens it doesn't become too wide (preserving information density) and on smaller desktops it doesn't become unusable.
- **Fluid Viewports**: The primary preview area occupies `1fr`, allowing it to expand and contract gracefully with the browser window, maximizing the visual area for mockup inspection.
- **Responsive Ordering**: Using CSS `order`, we prioritize the visual viewport on mobile devices (Top) while keeping it in the primary content flow for screen readers.

## 3. UI/UX Best Practices for AI

Generating AI content is asynchronous and prone to safety blocks. Our UX addresses this via:

- **Actionable Feedback**: Errors from the Gemini API are sanitized and mapped to "Diagnostics" with specific user actions (e.g., "Simplify your prompt" or "Check logo resolution").
- **Visual Synthesis Skeletons**: High-fidelity loading states that describe exactly what the AI is doing ("Synthesizing Masterpiece...", "Exploring Variations...").
- **Non-Blocking Asset Ingestion**: Logo and background uploads are handled in separate threads with concurrent UI updates to ensure the interface never feels "locked".

## 4. AI Service Implementation

The `AICoreService` is a robust facade for the `@google/genai` SDK:

- **Stateless Client Initialization**: Fresh `GoogleGenAI` instances are created per-call to ensure dynamic environment keys (from `process.env.API_KEY`) are respected without stale closures.
- **Token Budget Coordination**: Automatically manages `thinkingBudget` and `maxOutputTokens` to prevent truncated or empty responses during deep reasoning.
- **Resilient Retry Logic**: Implements exponential backoff with jitter for transient 429/503 errors.

## 5. Security & Privacy

- **Local-First Keys**: Platform credentials for Shopify, Etsy, etc., are stored exclusively in the user's `localStorage` and never persist on any server.
- **Prompt Sanitization**: Base64 data is cleaned and validated before being passed to the Generative model.

---

*Last Updated: 2024-05-24*