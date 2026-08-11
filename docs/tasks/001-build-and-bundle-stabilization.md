# 001 - Build And Bundle Stabilization

## Goal

Keep the production build passing and investigate current Vite bundle warnings so the project has a stable commercial baseline.

## Current Baseline

- `npm run build` passes as of 2026-07-14.
- No automated test suite exists yet.
- Original build warnings:
  - `three-stdlib/libs/lottie.js` uses `eval`;
  - some production chunks are larger than 500 kB;
  - largest observed chunks are approximately `1,016 kB` and `1,404 kB`.

Updated result:

- `npm run build` still passes.
- `npm run preview -- --host 127.0.0.1 --port 4173` returns `HTTP/1.1 200 OK`.
- Manual vendor chunks reduce the largest chunk to `three-vendor` at approximately `690 kB`.
- The remaining size warning is documented as acceptable for now because it is core Three.js runtime code.
- The `three-stdlib/libs/lottie.js` `eval` warning remains in a dependency and does not fail the build.

## Scope

- Inspect why the large chunks are produced.
- Identify whether large chunks come from expected 3D/runtime dependencies or avoidable imports.
- Check whether existing lazy imports in `src/components/Main.tsx` are effective.
- Decide whether manual chunking, further lazy loading, or warning threshold adjustment is justified.
- Document the decision.

## Non-goals

- Do not change gameplay behavior.
- Do not add new libraries without approval.
- Do not rewrite the rendering architecture.
- Do not introduce an automated test framework in this task.

## Likely Files

- `vite.config.ts`
- `src/components/Main.tsx`
- `src/components/Game.tsx`
- `src/components/Scene.tsx`
- `package.json`
- `docs/build-baseline.md`
- `docs/architecture-map.md`

## Acceptance Criteria

- `npm run build` still passes. Done.
- Bundle warnings are either reduced or explicitly documented as acceptable with rationale. Done.
- Any Vite config changes are small and limited to build output behavior. Done.
- Changed files are reported. Done in the final response for this task.
- Manual test steps are reported. Done in the final response for this task.

## Manual Test Steps

1. Run `npm run build`.
2. If build config changes, run `npm run preview`.
3. Open the preview URL.
4. Confirm the start menu appears.
5. Start the game and confirm the 3D scene renders.
