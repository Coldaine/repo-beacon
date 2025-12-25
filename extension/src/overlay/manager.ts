import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import { OverlayCommand } from './protocol';

/**
 * Manages the lifecycle of the overlay sidecar process.
 * Spawns, communicates with, and handles crashes of the overlay.
 */
export class OverlayManager {
  private process: ChildProcess | undefined;
  private respawnAttempts = 0;
  private isStopped = false;

  private static readonly MAX_RESPAWN_ATTEMPTS = 3;
  private static readonly RESPAWN_DELAY_MS = 1000;

  constructor(
    private readonly overlayBinaryPath: string,
    private readonly outputChannel: vscode.LogOutputChannel
  ) {}

  /**
   * Spawns the overlay process and sets up listeners for its lifecycle.
   */
  public start(): void {
    this.isStopped = false;
    this.spawnProcess();
  }

  private spawnProcess(): void {
    if (this.isStopped) {
      this.outputChannel.info('OverlayManager is stopped, not spawning.');
      return;
    }

    if (this.respawnAttempts >= OverlayManager.MAX_RESPAWN_ATTEMPTS) {
      this.outputChannel.error(
        `Overlay process crashed too many times. Giving up after ${OverlayManager.MAX_RESPAWN_ATTEMPTS} attempts.`
      );
      return;
    }

    try {
      let command: string;
      let args: string[];

      // If the path is a .js file, we assume it's the mock script and run it with Node.
      // Otherwise, we execute the binary directly.
      if (this.overlayBinaryPath.endsWith('.js')) {
        command = 'node';
        args = [this.overlayBinaryPath];
      } else {
        command = this.overlayBinaryPath;
        args = [];
      }

      this.outputChannel.info(`Spawning overlay process: ${command} ${args.join(' ')}`);
      this.process = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
      });

      // Reset respawn attempts on successful spawn
      this.respawnAttempts = 0;

      this.process.stdout?.on('data', (data) => {
        this.outputChannel.info(`[OVERLAY]: ${data.toString().trim()}`);
      });

      this.process.stderr?.on('data', (data) => {
        this.outputChannel.error(`[OVERLAY ERR]: ${data.toString().trim()}`);
      });

      this.process.on('error', (err) => {
        this.outputChannel.error(`Failed to start overlay process: ${err.message}`);
        this.handleCrash();
      });

      this.process.on('exit', (code) => {
        this.process = undefined;
        if (!this.isStopped) {
          this.outputChannel.warn(`Overlay process exited unexpectedly with code ${code}.`);
          this.handleCrash();
        } else {
          this.outputChannel.info('Overlay process exited cleanly.');
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        this.outputChannel.error(`Error spawning overlay process: ${error.message}`);
      } else {
        this.outputChannel.error('An unknown error occurred while spawning the overlay process.');
      }
      this.handleCrash();
    }
  }

  /**
   * Handles an unexpected crash by attempting to respawn the process after a delay.
   */
  private handleCrash(): void {
    if (this.isStopped) return;

    this.respawnAttempts++;
    this.outputChannel.info(
      `Attempting to respawn overlay... (Attempt ${this.respawnAttempts}/${OverlayManager.MAX_RESPAWN_ATTEMPTS})`
    );
    setTimeout(() => this.spawnProcess(), OverlayManager.RESPAWN_DELAY_MS);
  }

  /**
   * Sends a command to the overlay process via stdin.
   * The command is serialized as a newline-delimited JSON string.
   * @param command The command to send to the overlay.
   */
  public send(command: OverlayCommand): void {
    if (!this.process?.stdin) {
      this.outputChannel.warn('Attempted to send command, but overlay process is not running.');
      return;
    }

    try {
      const serializedCommand = JSON.stringify(command) + '\n';
      this.process.stdin.write(serializedCommand);
      this.outputChannel.info(`Sent command: ${command.type}`);
    } catch (error) {
        if (error instanceof Error) {
            this.outputChannel.error(`Failed to send command: ${error.message}`);
        } else {
            this.outputChannel.error('An unknown error occurred while sending a command.');
        }
    }
  }

  /**
   * Stops the overlay process cleanly.
   */
  public stop(): void {
    this.outputChannel.info('Stopping overlay manager...');
    this.isStopped = true;

    if (this.process) {
      this.send({ type: 'SHUTDOWN' });

      // Give the process a moment to shut down gracefully before forcing it.
      setTimeout(() => {
        if (this.process) {
          this.outputChannel.warn('Overlay process did not shut down gracefully. Killing.');
          this.process.kill('SIGKILL');
          this.process = undefined;
        }
      }, 500);
    }
  }
}
