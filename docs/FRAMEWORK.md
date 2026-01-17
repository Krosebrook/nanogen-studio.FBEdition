# Application Framework (FRAMEWORK)

## Stack
- **Status**: Confirmed
- **Evidence**: `package.json` reveals the following key libraries:
    - **React 19**: Core UI library. The use of version 19 indicates a modern, concurrent-aware application.
    - **Vite**: Frontend tooling for development and bundling. `vite.config.ts` is present.
    - **TypeScript**: Statically typed JavaScript, enforced via `tsconfig.json`.
    - **Tailwind CSS**: Utility-first CSS framework for styling.

## LLM Models & Roles
- **Gemini 2.5 Flash Image**: Primary model for rapid image synthesis, as seen in `ai-core.ts`.
- **Gemini 3 Pro Image**: Likely used for high-resolution or more complex image generation tasks (pro features).
- **Gemini 3 Flash/Pro**: Used for text-based analysis, reasoning, and generating contextual reports.

## Tooling Boundaries
- **Image Processing**: The application uses the **HTML5 Canvas API** for in-browser image manipulation, which is a standard approach for high-performance graphics.
- **Asset Ingestion**: File uploads are managed via the **Web File API**, ensuring compatibility with modern browsers.
- **3D Visualization**: The presence of `@react-three/fiber` and `@react-three/drei` indicates that the Merch Studio's 3D previews are rendered using Three.js within the React ecosystem.

## CI/CD Hooks
- **Documentation Authority**: A GitHub Actions workflow (`docs-authority.yml`) is in place to validate and build `llms-full.txt`, ensuring that the LLM documentation is always up-to-date.

---
**Provenance:**
- Source: `package.json`, `vite.config.ts`, `services/ai-core.ts`
- Confidence: HIGH
- Last Verified: 2024-05-24
