import * as vscode from 'vscode';
import { getWebviewContent } from './content';

export class BeaconPanel {
  private panel: vscode.WebviewPanel | undefined;
  private context: vscode.ExtensionContext;
  private dismissTimeout: NodeJS.Timeout | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public show(): void {
    const repoName = this.getRepoName();
    const config = this.getConfig();

    if (this.panel) {
      // Panel exists, just update and show
      this.panel.webview.html = getWebviewContent(repoName, config);
      this.panel.reveal(vscode.ViewColumn.One);
    } else {
      // Create new panel
      this.panel = vscode.window.createWebviewPanel(
        'repoBeacon',
        'RepoBeacon',
        {
          viewColumn: vscode.ViewColumn.One,
          preserveFocus: true,
        },
        {
          enableScripts: true,
          retainContextWhenHidden: false,
        }
      );

      this.panel.webview.html = getWebviewContent(repoName, config);

      // Handle panel disposal
      this.panel.onDidDispose(() => {
        this.panel = undefined;
        if (this.dismissTimeout) {
          clearTimeout(this.dismissTimeout);
          this.dismissTimeout = undefined;
        }
      });
    }

    // Auto-dismiss after duration
    this.scheduleDismiss(config.duration);
  }

  private scheduleDismiss(duration: number): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }

    this.dismissTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  public hide(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = undefined;
    }
  }

  public dispose(): void {
    this.hide();
  }

  private getRepoName(): string {
    // Try to get from workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].name;
    }

    // Fallback to "Untitled"
    return 'Untitled';
  }

  private getConfig(): BeaconConfig {
    const config = vscode.workspace.getConfiguration('repoBeacon');
    
    return {
      style: config.get<string>('style', 'pulse'),
      colorScheme: config.get<string>('colorScheme', 'auto'),
      customColor: config.get<string>('customColor', '#3b82f6'),
      position: config.get<string>('position', 'center'),
      opacity: config.get<number>('opacity', 0.9),
      duration: config.get<number>('duration', 3000),
      fontSize: config.get<string>('fontSize', '2rem'),
    };
  }
}

export interface BeaconConfig {
  style: string;
  colorScheme: string;
  customColor: string;
  position: string;
  opacity: number;
  duration: number;
  fontSize: string;
}
