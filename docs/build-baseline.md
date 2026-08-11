# Build Baseline - Snake 3D

Last checked: 2026-07-14

## Command

```bash
npm run build
```

## Result

Build status: pass.
Preview smoke status: pass.
Development server smoke status: pass.

The project successfully completes:

```text
tsc && vite build
```

Observed output:

```text
vite v5.4.19 building for production...
911 modules transformed.
built in 9.65s
```

## Notes

The first build attempt inside the managed sandbox failed before TypeScript or Vite ran:

```text
Error: EPERM: operation not permitted, lstat 'C:\Users\HP'
```

The same command passed when run with the required filesystem permission.

`npm run preview -- --host 127.0.0.1 --port 4173` was also checked with `curl -I` and returned:

```text
HTTP/1.1 200 OK
```

`npm run dev -- --host 127.0.0.1 --port 5174` was checked with `curl -I` and returned:

```text
HTTP/1.1 200 OK
```

## Warnings

Current warnings do not fail the build:

- `node_modules/three-stdlib/libs/lottie.js` uses `eval`.
- One production chunk is larger than 500 kB after minification.
- Largest observed chunk after manual vendor splitting is `three-vendor` at approximately `690 kB` uncompressed and `177 kB` gzip.

## Bundle Decision

The previous large chunks of approximately `1,016 kB` and `1,404 kB` were reduced by adding Vite `manualChunks` for React, Three.js, React Three Fiber, Drei/three-stdlib, and debug tooling.

The remaining `three-vendor` warning is accepted for now because it contains core Three.js runtime code used by the 3D renderer. Further reduction should be handled by feature-level lazy loading or deeper dependency review, not by arbitrary chunk threshold changes.

## Follow-up

Track future bundle work in `docs/tasks/001-build-and-bundle-stabilization.md`.
