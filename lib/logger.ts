const LOG_PREFIX = "[BusETA]";
const isDev = process.env.NODE_ENV === "development";

type LogContext = Record<string, unknown>;

function formatMessage(level: string, message: string, context?: LogContext): string {
  if (context && Object.keys(context).length > 0) {
    return `${LOG_PREFIX} [${level}] ${message} ${JSON.stringify(context)}`;
  }
  return `${LOG_PREFIX} [${level}] ${message}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.info(formatMessage("INFO", message, context));
  },
  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage("WARN", message, context));
  },
  error(message: string, context?: LogContext): void {
    console.error(formatMessage("ERROR", message, context));
  },
  debug(message: string, context?: LogContext): void {
    if (isDev) {
      console.debug(formatMessage("DEBUG", message, context));
    }
  },
};
