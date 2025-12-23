import * as vscode from 'vscode';
import { BeaconPanel } from './webview/BeaconPanel';

let beaconPanel: BeaconPanel | undefined;
let timerInterval: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('RepoBeacon is now active');

  // Initialize the beacon panel manager
  beaconPanel = new BeaconPanel(context);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('repoBeacon.toggle', () => {
      const config = vscode.workspace.getConfiguration('repoBeacon');
      const currentValue = config.get<boolean>('enabled', true);
      config.update('enabled', !currentValue, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `RepoBeacon ${!currentValue ? 'enabled' : 'disabled'}`
      );
    }),

    vscode.commands.registerCommand('repoBeacon.showNow', () => {
      if (isEnabled()) {
        beaconPanel?.show();
      } else {
        vscode.window.showWarningMessage('RepoBeacon is disabled. Enable it first.');
      }
    }),

    vscode.commands.registerCommand('repoBeacon.changeStyle', async () => {
      const styles = [
        { label: 'Pulse', description: 'Breathing/pulsing glow effect', value: 'pulse' },
        { label: 'Shimmer', description: 'Shiny sweep effect', value: 'shimmer' },
        { label: 'Fade', description: 'Fade in/out cycle', value: 'fade' },
      ];
      
      const selected = await vscode.window.showQuickPick(styles, {
        placeHolder: 'Select animation style',
      });
      
      if (selected) {
        const config = vscode.workspace.getConfiguration('repoBeacon');
        await config.update('style', selected.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Animation style set to ${selected.label}`);
      }
    }),

    vscode.commands.registerCommand('repoBeacon.changeColorScheme', async () => {
      const schemes = [
        { label: 'Auto', description: 'Detect from project type', value: 'auto' },
        { label: 'Frontend', description: 'Orange/Red (warm)', value: 'frontend' },
        { label: 'Backend', description: 'Blue/Purple (cool)', value: 'backend' },
        { label: 'Data', description: 'Green/Teal', value: 'data' },
        { label: 'DevOps', description: 'Cyan/Gray', value: 'devops' },
        { label: 'Mobile', description: 'Pink/Magenta', value: 'mobile' },
        { label: 'Custom', description: 'Use custom color', value: 'custom' },
      ];
      
      const selected = await vscode.window.showQuickPick(schemes, {
        placeHolder: 'Select color scheme',
      });
      
      if (selected) {
        const config = vscode.workspace.getConfiguration('repoBeacon');
        await config.update('colorScheme', selected.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Color scheme set to ${selected.label}`);
      }
    })
  );

  // Window focus detection
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((state) => {
      if (state.focused && isEnabled() && isTriggerOnFocusEnabled()) {
        beaconPanel?.show();
      }
    })
  );

  // Timer-based trigger
  setupTimer();

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('repoBeacon.timerEnabled') ||
          e.affectsConfiguration('repoBeacon.timerInterval')) {
        setupTimer();
      }
    })
  );

  // Show on initial activation if configured
  if (isEnabled() && isTriggerOnFocusEnabled()) {
    // Small delay to ensure VS Code is fully loaded
    setTimeout(() => {
      beaconPanel?.show();
    }, 1000);
  }
}

function isEnabled(): boolean {
  return vscode.workspace.getConfiguration('repoBeacon').get<boolean>('enabled', true);
}

function isTriggerOnFocusEnabled(): boolean {
  return vscode.workspace.getConfiguration('repoBeacon').get<boolean>('triggerOnFocus', true);
}

function setupTimer(): void {
  // Clear existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }

  const config = vscode.workspace.getConfiguration('repoBeacon');
  const timerEnabled = config.get<boolean>('timerEnabled', false);
  const interval = config.get<number>('timerInterval', 30000);

  if (timerEnabled && isEnabled()) {
    timerInterval = setInterval(() => {
      if (isEnabled()) {
        beaconPanel?.show();
      }
    }, interval);
  }
}

export function deactivate() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  beaconPanel?.dispose();
}
