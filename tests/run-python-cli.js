import { spawnSync } from 'node:child_process';

const candidates = [process.env.PYTHON || 'python3', 'python'];
let last;

for (const candidate of candidates) {
  const result = spawnSync(candidate, ['-m', 'test_signal', ...process.argv.slice(2)], {
    encoding: 'utf8',
    env: process.env
  });

  if (result.error?.code === 'ENOENT') {
    last = result;
    continue;
  }

  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exit(result.status ?? 1);
}

process.stderr.write(last?.error?.message ?? 'No Python interpreter found');
process.exit(127);
