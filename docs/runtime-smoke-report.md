# Runtime Smoke Report - Snake 3D

Last checked: 2026-07-15

## Scope

This report records the current launch smoke status for development and production-preview servers.

The project currently has no browser automation suite. This check verifies that Vite serves the app shell successfully, but it does not replace manual WebGL/gameplay testing.

## Environment Notes

Running npm scripts inside the managed sandbox can fail before Vite starts:

```text
Error: EPERM: operation not permitted, lstat 'C:\Users\HP'
```

The commands below were checked with the required filesystem permission.

## Development Server

Command:

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

Result:

```text
VITE v5.4.19 ready in 731 ms
HTTP/1.1 200 OK
```

Status: pass.

The dev server was stopped after the check.

## Production Preview

Command:

```bash
npm run preview -- --host 127.0.0.1 --port 4173
```

Result:

```text
HTTP/1.1 200 OK
```

Status: pass.

The preview server was stopped after the check.

## Browser Automation

No local browser automation tool is configured:

- no Playwright package is installed;
- no project `tests/` directory exists;
- browser commands such as `chrome`, `msedge`, and `playwright` were not available from the shell.

## Manual Checks Still Required

Use `docs/manual-test-checklist.md` or `docs/manual-test-checklist.ru.md` to verify:

- start menu appears visually;
- WebGL canvas renders a nonblank 3D scene;
- snake movement works;
- food collection works;
- pause and resume work;
- collision and game-over behavior work;
- browser console has no blocking runtime errors.

## Manual Check Update - 2026-07-15

The user provided a marked manual checklist screenshot. The core startup, gameplay, collision, pause/menu, rendering/performance, and build checks were marked as passed.

Recorded report:

```text
docs/manual-test-report-2026-07-15.md
```

Remaining follow-up items:

- invalid or unavailable level URL behavior;
- bonus spawn timing;
- bonus effects;
- moving or breakable obstacle behavior, if enabled in current level data.
