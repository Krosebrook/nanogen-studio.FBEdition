
export type AppMode = 'EDITOR' | 'MERCH' | 'INTEGRATIONS';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  type: 'edit' | 'merch';
}

// Re-exporting feature specific interfaces if they need to be accessed globally,
// though ideally they should stay within their feature modules.
// For the AppMode switch in App.tsx, we only need AppMode.
