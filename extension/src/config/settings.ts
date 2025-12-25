import * as vscode from 'vscode';

export function getRepoBeaconSettings() {
  const config = vscode.workspace.getConfiguration('repoBeacon');

  return {
    get enabled(): boolean {
      return config.get<boolean>('enabled', true);
    },
    get style(): string {
      return config.get<string>('style', 'pulse');
    },
    get colorScheme(): string {
      return config.get<string>('colorScheme', 'auto');
    },
    get duration(): number {
      return config.get<number>('duration', 3000);
    },
    get opacity(): number {
      return config.get<number>('opacity', 0.9);
    },
    get fontSize(): string {
      return config.get<string>('fontSize', '4rem');
    },
    get position(): string {
        // Assuming a 'position' setting might be added later, providing a default.
        return config.get<string>('position', 'center');
    }
  };
}

export function isEnabled(): boolean {
  return vscode.workspace.getConfiguration('repoBeacon').get<boolean>('enabled', true);
}
