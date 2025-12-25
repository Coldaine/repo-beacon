import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { OverlayManager } from './overlay/manager';
import { getRepoBeaconSettings, isEnabled } from './config/settings';
import { registerCommands } from './commands';

let overlayManager: OverlayManager | undefined;
let outputChannel: vscode.LogOutputChannel;

export function activate(context: vscode.ExtensionContext) {
  // Create a log output channel for debugging
  outputChannel = vscode.window.createOutputChannel('RepoBeacon', { log: true });
  context.subscriptions.push(outputChannel);
  outputChannel.info('RepoBeacon is activating...');

  // Determine the path to the overlay binary
  const binaryPath = getOverlayBinaryPath(context.extensionPath);

  if (!binaryPath) {
    vscode.window.showErrorMessage('RepoBeacon overlay binary not found for this platform.');
    outputChannel.error('Overlay binary not found.');
    return;
  }

  // Initialize and start the overlay manager
  overlayManager = new OverlayManager(binaryPath, outputChannel);
  overlayManager.start();
  context.subscriptions.push({ dispose: () => overlayManager?.stop() });

  // Register commands
  registerCommands(context, overlayManager, outputChannel);

  // Listen for window focus changes
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((state) => {
      if (state.focused && isEnabled()) {
        outputChannel.info('Window focused, triggering show command.');
        vscode.commands.executeCommand('repoBeacon.showNow');
      }
    })
  );

  // Initial trigger on startup if a workspace is open
  if (vscode.window.state.focused && isEnabled()) {
    outputChannel.info('Initial activation, triggering show command.');
     // Use a small delay to ensure the overlay has time to initialize
    setTimeout(() => vscode.commands.executeCommand('repoBeacon.showNow'), 500);
  }

  outputChannel.info('RepoBeacon activated successfully.');
}

function getOverlayBinaryPath(extensionPath: string): string | null {
    // For development, we'll use a mock Node.js script.
    // In a real build, this would point to the compiled Tauri binary.
    const mockScriptPath = path.join(extensionPath, 'bin', 'mock-overlay.js');

    // To run the script, we need to spawn 'node' with the script as an argument.
    // The OverlayManager will handle this. We return the path to the script itself.
    outputChannel.info(`Using mock overlay script at: ${mockScriptPath}`);
    return mockScriptPath;
}


export function deactivate() {
  outputChannel.info('RepoBeacon deactivating...');
  overlayManager?.stop();
  outputChannel.info('RepoBeacon deactivated.');
}
