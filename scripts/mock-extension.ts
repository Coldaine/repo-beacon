// scripts/mock-extension.ts
// A mock extension that sends a sequence of commands to stdout.

async function main() {
  console.error('[Mock Extension] Starting...');

  // Listen for responses from the overlay
  process.stdin.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.length > 0);
    lines.forEach(line => {
      console.error(`[Mock Extension] Received response: ${line}`);
    });
  });

  const commands = [
    { type: 'SHOW', payload: { repoName: 'test-repo', style: 'pulse', colorScheme: 'backend', duration: 3000 } },
    { type: 'CONFIG', payload: { opacity: 0.9, fontSize: '4rem' } },
    { type: 'HIDE' },
    { type: 'SHUTDOWN' }
  ];

  for (const command of commands) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between commands
    const commandString = JSON.stringify(command);
    console.error(`[Mock Extension] Sending command: ${commandString}`);
    process.stdout.write(commandString + '\n');
  }

  console.error('[Mock Extension] All commands sent.');
}

main();
