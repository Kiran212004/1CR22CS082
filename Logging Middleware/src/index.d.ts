export interface LogOptions {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package: string;
  message: string;
  accessToken: string;
}
export declare function log(options: LogOptions): Promise<void>;
