// scripts/test-ipc.ts
// A test harness to validate IPC communication between the mock extension and overlay.
import { spawn } from 'child_process';

function main() {
  console.log('[Test Harness] Starting IPC protocol validation...');

  const mockExtension = spawn('ts-node', ['scripts/mock-extension.ts'], {
    stdio: ['pipe', 'pipe', 'pipe'] // stdin, stdout, stderr
  });

  const mockOverlay = spawn('ts-node', ['scripts/mock-overlay.ts'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Pipe the mock extension's output to the mock overlay's input
  mockExtension.stdout.pipe(mockOverlay.stdin);
  mockOverlay.stdout.pipe(mockExtension.stdin);

  mockExtension.stderr.on('data', (data) => {
    console.error(`[Mock Extension stderr]: ${data}`);
  });

  mockOverlay.stderr.on('data', (data) => {
    console.error(`[Mock Overlay stderr]: ${data}`);
  });

  mockExtension.on('close', (code) => {
    console.log(`[Test Harness] Mock extension exited with code ${code}`);
  });

  mockOverlay.on('close', (code) => {
    console.log(`[Test Harness] Mock overlay exited with code ${code}`);
  });
}

main();
