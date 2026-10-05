import pino, { type Logger } from "pino";
import { env } from "./env.config.ts";



export function createLogger(destination?: string): Logger {
  const targets = [
    ...(env.NODE_ENV !== "production"
      ? [{
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }]
      : []),
    ...(destination
      ? [{ target: "pino/file", options: { destination, mkdir: true } }]
      : []),
  ];

  return pino(
    {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: ["password", "token"],
      base: { pid: false },
    },
    targets.length > 0 ? pino.transport({ targets }) : undefined,
  );
}

export const logger = createLogger();
