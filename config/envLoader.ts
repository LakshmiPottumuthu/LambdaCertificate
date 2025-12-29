import dotenv from 'dotenv';
import path from 'path';

export function loadEnv(): void {
  const env = process.env.ENV || 'staging';

  const envPath = path.resolve(
    process.cwd(),        // project root
    'config',
    'environments',       // 👈 this folder MUST exist
    `.env.${env}`         // .env.staging
  );

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(`Failed to load environment file: .env.${env}`);
  }
}
