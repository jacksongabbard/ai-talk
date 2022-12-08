import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      context?: {
        user?: User | null | undefined;
        team?: Team | null | undefined;
      };
    }
  }
}
