# Agent Rules - Snake 3D

## Before coding

1. Read `docs/architecture-map.md`.
2. Read the current issue or PRD from `docs/tasks/`, if one exists.
3. Work only on the requested task.
4. Do not rewrite the architecture.

## Coding rules

1. Keep changes small.
2. Do not change unrelated gameplay behavior.
3. Put gameplay logic in `src/engine`.
4. Put rendering logic in `src/components` or `src/assets`.
5. Put level parameters in level JSON files.
6. Do not add new libraries without approval.

## Validation

1. Run `npm run build`.
2. There is no automated test suite yet. If gameplay logic changed, describe manual test steps.
3. Report changed files.
4. Report manual test steps.
