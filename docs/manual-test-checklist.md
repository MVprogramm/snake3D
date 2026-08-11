# Manual Test Checklist - Snake 3D

Use this checklist after gameplay, rendering, input, level, or UI changes.

## Startup

1. Run `npm run dev`.
2. Open the local Vite URL in a browser.
3. Confirm the game loads without a blank screen.
4. Confirm no blocking errors appear in the browser console.
5. Confirm the start menu appears.

## Basic Gameplay

1. Start the game from the menu.
2. Move the snake with keyboard controls.
3. Confirm the snake changes direction predictably.
4. Confirm the snake cannot reverse into itself by an accidental 180-degree turn.
5. Collect food.
6. Confirm score or progress updates.
7. Confirm the snake grows after collecting food.

## Collisions

1. Hit the field border and confirm the expected loss/game-over behavior.
2. Hit the snake body and confirm the expected loss/game-over behavior.
3. Hit an obstacle and confirm the expected collision behavior.
4. Confirm collisions are understandable and not visually delayed.

## Pause And Menu

1. Pause the game.
2. Confirm gameplay stops while paused.
3. Resume the game.
4. Confirm keyboard controls work after resume.
5. Restart after game over.

## Levels And Progression

1. Complete enough food goals to advance level, if the changed area touches levels.
2. Confirm level parameters load correctly: field, food count, timer, score target, lives, obstacles, and bonuses.
3. Confirm invalid or unavailable level URLs show an error screen instead of crashing.

## Bonuses And Obstacles

1. Confirm configured bonuses appear at the expected progression points.
2. Confirm each changed bonus applies only its intended effect.
3. Confirm obstacles spawn in valid cells.
4. Confirm moving or breakable obstacles behave as expected, if touched by the task.

## Rendering And Performance

1. Confirm snake, food, field, obstacles, lights, and landscape render.
2. Confirm camera follows the snake and keeps gameplay readable.
3. Confirm the game remains playable for several minutes.
4. Confirm no major frame drops or memory-related browser warnings appear during normal play.

## Build

1. Run `npm run build`.
2. Confirm the build completes successfully.
3. If build output is inspected, run `npm run preview` and repeat the startup smoke test.
