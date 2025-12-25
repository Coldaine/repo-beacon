const fs = require('fs');
const os = require('os');
const logPath = require('path').join(os.tmpdir(), 'repobeacon-mock-overlay.log');

function log(message) {
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
}

log('Mock overlay process started.');

process.stdin.on('data', (chunk) => {
  const message = chunk.toString().trim();
  log(`Received command: ${message}`);

  if (message.includes('"type":"SHUTDOWN"')) {
    log('Shutdown command received. Exiting.');
    process.exit(0);
  }
});

process.on('exit', (code) => {
  log(`Exiting with code ${code}`);
});

// Simulate being ready
setTimeout(() => {
    process.stdout.write('{"type":"READY"}\n');
    log('Sent READY response.');
}, 500);
