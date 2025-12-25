// scripts/mock-overlay.ts
// A mock overlay that logs commands received from stdin.

function main() {
  // Signal that the mock overlay is ready to receive commands.
  process.stdout.write(JSON.stringify({ type: 'READY' }) + '\n');

  process.stdin.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.length > 0);
    lines.forEach(line => {
      try {
        const command = JSON.parse(line);
        console.error(`[Mock Overlay] Received command: ${JSON.stringify(command)}`);

        // Acknowledge the command
        process.stdout.write(JSON.stringify({ type: 'ACK', command: command.type }) + '\n');

        if (command.type === 'SHUTDOWN') {
          process.exit(0);
        }
      } catch (error) {
        console.error(`[Mock Overlay] Error parsing command: ${line}`);
      }
    });
  });

  process.stdin.on('end', () => {
    console.error('[Mock Overlay] Stdin closed.');
  });
}

main();
