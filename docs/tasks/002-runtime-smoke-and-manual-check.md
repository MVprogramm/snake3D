# 002 - Runtime Smoke And Manual Check

## Goal

Confirm that the game launches through development and production-preview servers, then define the remaining manual gameplay checks required before commercial stabilization can continue.

## Current Result

- `npm run dev -- --host 127.0.0.1 --port 5174` returns `HTTP/1.1 200 OK`.
- `npm run preview -- --host 127.0.0.1 --port 4173` returns `HTTP/1.1 200 OK`.
- Both temporary servers were stopped after checking.
- Browser automation is not currently available in the project.
- User-provided manual checklist screenshot on 2026-07-15 confirms the core gameplay smoke path.

## Scope

- Verify dev server HTTP startup.
- Verify production preview HTTP startup.
- Record the limits of non-browser smoke testing.
- Keep manual gameplay checks in `docs/manual-test-checklist.md`.

## Non-goals

- Do not change gameplay behavior.
- Do not add browser automation dependencies in this task.
- Do not rewrite UI or rendering code.

## Acceptance Criteria

- Dev server responds with HTTP 200. Done.
- Production preview responds with HTTP 200. Done.
- Server processes are stopped after checks. Done.
- Manual WebGL/gameplay checks are documented. Done.
- Core manual gameplay smoke is marked as passed. Done.

## Follow-up Items

- Invalid or unavailable level URL behavior was not clearly marked as passed.
- Bonus spawn timing was not clearly marked as passed.
- Bonus effects were not clearly marked as passed.
- Moving or breakable obstacle behavior was not clearly marked as passed.

## Manual Test Steps

Run the checklist in `docs/manual-test-checklist.md`, especially:

1. Open the game in a browser.
2. Confirm the start menu appears.
3. Start the game.
4. Confirm the 3D scene is visible.
5. Move the snake.
6. Collect food.
7. Pause and resume.
8. Trigger a collision and confirm game-over behavior.
