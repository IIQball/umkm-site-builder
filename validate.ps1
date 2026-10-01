bun run type-check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
bun run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
bun run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
bun run test
