import * as vscode from 'vscode';
import { OverlayManager } from '../overlay/manager';
import { getRepoBeaconSettings, isEnabled } from '../config/settings';

/**
 * A helper function to construct and send the SHOW command.
 * This can be called from multiple places (e.g., on focus, or via command).
 */
function triggerShowCommand(overlayManager: OverlayManager, outputChannel: vscode.LogOutputChannel) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    outputChannel.info('No workspace folder open, not showing overlay.');
    return;
  }

  const settings = getRepoBeaconSettings();
  const repoName = workspaceFolder.name;

  overlayManager.send({
    type: 'SHOW',
    payload: {
      repoName,
      style: settings.style,
      colorScheme: settings.colorScheme,
      duration: settings.duration,
    },
  });
}

/**
 * Registers all commands for the RepoBeacon extension.
 * @param context The extension context.
 * @param overlayManager The instance of the OverlayManager.
 * @param outputChannel The log output channel.
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  overlayManager: OverlayManager,
  outputChannel: vscode.LogOutputChannel
) {
  context.subscriptions.push(
    // Command to toggle the extension's enabled state
    vscode.commands.registerCommand('repoBeacon.toggle', () => {
      const config = vscode.workspace.getConfiguration('repoBeacon');
      const currentValue = config.get<boolean>('enabled', true);
      config.update('enabled', !currentValue, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`RepoBeacon ${!currentValue ? 'enabled' : 'disabled'}`);
    }),

    // Command to manually trigger the overlay
    vscode.commands.registerCommand('repoBeacon.showNow', () => {
      if (isEnabled()) {
        outputChannel.info('showNow command triggered.');
        triggerShowCommand(overlayManager, outputChannel);
      } else {
        vscode.window.showWarningMessage('RepoBeacon is disabled. Enable it first.');
      }
    }),

    // Command to change the animation style via a Quick Pick menu
    vscode.commands.registerCommand('repoBeacon.changeStyle', async () => {
      const styles = [
        { label: 'Pulse', description: 'Breathing/pulsing glow effect', value: 'pulse' },
        { label: 'Shimmer', description: 'Shiny sweep effect', value: 'shimmer' },
        { label: 'Fade', description: 'Fade in/out cycle', value: 'fade' },
      ];
      const selected = await vscode.window.showQuickPick(styles, { placeHolder: 'Select animation style' });
      if (selected) {
        const config = vscode.workspace.getConfiguration('repoBeacon');
        await config.update('style', selected.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Animation style set to ${selected.label}`);
      }
    }),

    // Command to change the color scheme via a Quick Pick menu
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
      const selected = await vscode.window.showQuickPick(schemes, { placeHolder: 'Select color scheme' });
      if (selected) {
        const config = vscode.workspace.getConfiguration('repoBeacon');
        await config.update('colorScheme', selected.value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Color scheme set to ${selected.label}`);
      }
    })
  );
}
