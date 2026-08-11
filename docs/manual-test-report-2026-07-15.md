# Manual Test Report - 2026-07-15

Source: user-provided marked screenshot of `docs/manual-test-checklist.ru.md`.

## Summary

Manual gameplay smoke check mostly passed.

The core loop is confirmed:

- startup;
- visible start menu;
- game starts from menu;
- keyboard movement;
- predictable direction changes;
- 180-degree reverse prevention;
- food collection;
- score/progress update;
- snake growth after food;
- border/body/obstacle collision behavior;
- pause/resume;
- restart after game end;
- rendering of snake, food, field, obstacles, light, and environment;
- camera readability;
- several minutes of playable runtime;
- no visible memory/FPS warnings during normal play;
- `npm run build`;
- production preview startup.

## Passed Sections

### Startup

All startup checks were marked as passed.

### Basic Gameplay

All basic gameplay checks were marked as passed.

### Collisions

All collision checks were marked as passed.

### Pause And Menu

All pause/menu checks were marked as passed.

### Rendering And Performance

All rendering/performance checks were marked as passed.

### Build

All build checks were marked as passed.

## Partially Confirmed Sections

### Levels And Progression

The following checks were marked as passed:

- collecting enough food to move toward the next level/progression check;
- level parameters load correctly.

The invalid or unavailable level URL check was not clearly marked as passed in the screenshot and should be checked separately.

### Bonuses And Obstacles

The following check was marked as passed:

- obstacles appear in valid cells.

The following bonus/obstacle checks were not clearly marked as passed and should be checked separately:

- configured bonuses appear at expected progression points;
- each changed bonus applies only its intended effect;
- moving or breakable obstacles behave as expected.

## Follow-up Checks

1. Verify invalid level URL behavior.
2. Verify bonus spawn timing.
3. Verify bonus effects.
4. Verify moving or breakable obstacle behavior, if those obstacle types are enabled in current level data.

## Result

Status: pass with follow-up items.

The game is stable enough to continue commercial stabilization work, but bonus/invalid-level edge cases should remain open until explicitly verified.
