import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) {
  throw new Error('Usage: node scripts/capture-client-feedback.mjs <before|after> [--mobile]');
}
const mobile = process.argv.includes('--mobile');

const root = path.resolve(import.meta.dirname, '..');
const outputDir = mobile ? path.join(os.tmpdir(), 'au-mg-mobile-check') : path.join(root, 'qa', 'client-feedback-20261001');
const suffix = mobile ? `-${phase}-390` : `-${phase}`;
const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
];
const chrome = chromeCandidates.find((candidate) => candidate && exists(candidate));
if (!chrome) throw new Error('Google Chrome was not found');

function exists(file) {
  try {
    return Boolean(requireStat(file));
  } catch {
    return false;
  }
}

function requireStat(file) {
  return process.getBuiltinModule('fs').statSync(file);
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForFile(file, attempts = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await readFile(file, 'utf8');
    } catch {
      await wait(50);
    }
  }
  throw new Error(`Timed out waiting for ${file}`);
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
}

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  return new CdpClient(socket);
}

async function capture(client, spec) {
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });
  await client.send('Page.enable', {}, sessionId);
  await client.send('Runtime.enable', {}, sessionId);
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: mobile ? 390 : 1440,
    height: mobile ? 844 : 1000,
    deviceScaleFactor: 1,
    mobile
  }, sessionId);
  await client.send('Page.navigate', { url: spec.url }, sessionId);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const state = await client.send('Runtime.evaluate', {
      expression: 'document.readyState',
      returnByValue: true
    }, sessionId);
    if (state.result.value === 'complete') break;
    await wait(50);
  }
  await wait(300);
  await client.send('Runtime.evaluate', {
    expression: spec.prepare,
    awaitPromise: true,
    returnByValue: true
  }, sessionId);
  await wait(250);
  const { data } = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  }, sessionId);
  await writeFile(path.join(outputDir, spec.file), Buffer.from(data, 'base64'));
  await client.send('Target.closeTarget', { targetId });
}

await mkdir(outputDir, { recursive: true });
const profile = path.join(os.tmpdir(), `au-mg-feedback-${process.pid}-${Date.now()}`);
await mkdir(profile, { recursive: true });
const chromeProcess = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--disable-extensions',
  '--no-first-run',
  '--no-default-browser-check',
  '--allow-file-access-from-files',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

try {
  const [port, browserPath] = (await waitForFile(path.join(profile, 'DevToolsActivePort'))).trim().split(/\r?\n/);
  const client = await connect(`ws://127.0.0.1:${port}${browserPath}`);
  const url = (relative, query = '') => `${pathToFileURL(path.join(root, 'dist', relative)).href}${query}`;
  const specs = [
    {
      file: `01-guide-hub${suffix}.png`,
      url: url('index.html', '?category=All%20guides&q=MG4%20CHARGING'),
      prepare: `(() => {
        const input = document.querySelector('[data-guide-search]');
        input.value = 'MG4 CHARGING';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('.content-switch').scrollIntoView({ block: 'start' });
      })()`
    },
    {
      file: `02-charging-article${suffix}.png`,
      url: url(path.join('ac-and-dc-ev-charging', 'index.html')),
      prepare: `(() => {
        document.querySelector('.guide-article').scrollIntoView({ block: 'start' });
        if (innerWidth <= 390) scrollBy(0, -110);
      })()`
    },
    {
      file: `03-questions${suffix}.png`,
      url: url(path.join('questions', 'index.html')),
      prepare: `(() => {
        const input = document.querySelector('[data-faq-search]');
        input.value = '25000';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('.questions-section').scrollIntoView({ block: 'start' });
      })()`
    }
  ];
  for (const spec of specs) await capture(client, spec);
  client.socket.close();
} finally {
  chromeProcess.kill();
  await Promise.race([once(chromeProcess, 'exit'), wait(1500)]).catch(() => {});
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profile, { recursive: true, force: true });
      break;
    } catch (error) {
      if (attempt === 4 && error.code !== 'EBUSY') throw error;
      await wait(200);
    }
  }
}

console.log(`Captured ${phase} screenshots in ${outputDir}`);
