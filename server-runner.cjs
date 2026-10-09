const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const currentMajor = parseInt(process.versions.node.split('.')[0], 10);
const args = process.argv.slice(2);

let nodePath = process.execPath;

if (currentMajor < 18) {
  const home = process.env.HOME || '/home/basilisko';
  const nvmVersionsDir = path.join(home, '.nvm', 'versions', 'node');
  if (fs.existsSync(nvmVersionsDir)) {
    const versions = fs.readdirSync(nvmVersionsDir)
      .filter((v) => v.startsWith('v'))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    for (const v of versions) {
      const major = parseInt(v.slice(1).split('.')[0], 10);
      if (major >= 18) {
        const candidate = path.join(nvmVersionsDir, v, 'bin', 'node');
        if (fs.existsSync(candidate)) {
          nodePath = candidate;
          break;
        }
      }
    }
  }
}

const serverScript = path.join(__dirname, 'server.js');
const nodeBinDir = path.dirname(nodePath);
const env = { ...process.env, PATH: `${nodeBinDir}:${process.env.PATH || ''}` };

// If '--watch' was passed in args, pass it before the script
const spawnArgs = args.includes('--watch')
  ? ['--watch', serverScript]
  : [serverScript, ...args];

const child = spawn(nodePath, spawnArgs, {
  stdio: 'inherit',
  env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code || 0);
  }
});
