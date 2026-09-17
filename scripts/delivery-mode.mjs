import { spawnSync } from 'node:child_process';
import { resolveDelivery } from '../src/lib/delivery.js';

const [mode, operation = 'build'] = process.argv.slice(2);
resolveDelivery({ MG_SHELL_MODE: mode });
if (!['build', 'package', 'dev'].includes(operation)) throw new Error('Invalid delivery operation');
// npm_execpath avoids Windows shell quoting and propagates the mode to every step.
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', operation], {
  stdio: 'inherit', env: { ...process.env, MG_SHELL_MODE: mode }
});
process.exit(result.status ?? 1);
