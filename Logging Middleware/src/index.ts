// Logging Middleware reusable package
import axios from 'axios';

export interface LogOptions {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
  accessToken: string;
}

export async function log({ stack, level, package: pkg, message, accessToken }: LogOptions): Promise<void> {
  try {
    await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    // Optionally handle logging errors (do not throw)
  }
}
