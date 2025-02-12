import pino from "pino";

const logger = pino({
  transport: {
    // Use pino-pretty by default in production, technically not recommended in
    // production. Remove this to use the default pino JSON logger.
    target: "pino-pretty",
  },
});
export default logger;
