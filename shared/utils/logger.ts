
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.INFO;

  private constructor() {
    // In production, this could be configured via environment variables
    this.level = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }

  private format(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  public debug(message: string, context?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(this.format('DEBUG', message), context || '');
    }
  }

  public info(message: string, context?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.info(this.format('INFO', message), context || '');
    }
  }

  public warn(message: string, context?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.format('WARN', message), context || '');
    }
  }

  public error(message: string, context?: any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.format('ERROR', message), context || '');
      // Production monitoring integration (Sentry, etc.) would go here
    }
  }
}

export const logger = Logger.getInstance();
