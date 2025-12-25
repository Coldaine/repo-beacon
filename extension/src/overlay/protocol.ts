// IPC message types and serialization

/**
 * Commands sent from the VS Code extension to the overlay process.
 */
export type OverlayCommand =
  | { type: 'SHOW'; payload: { repoName: string; style: string; colorScheme: string; duration: number } }
  | { type: 'HIDE' }
  | { type: 'CONFIG'; payload: { opacity: number; fontSize: string; position: string } }
  | { type: 'SHUTDOWN' };

/**
 * Responses sent from the overlay process back to the VS Code extension.
 * Useful for debugging and confirming state.
 */
export type OverlayResponse =
  | { type: 'READY' }
  | { type: 'SHOWN' }
  | { type: 'HIDDEN' }
  | { type: 'ERROR'; message: string };
