import { Client, GatewayIntentBits } from "discord.js";
import { getConfigFromEnv, type ConfigType } from "./config";
import logger from "./logger";
import ReviewCommand from "./commands/ReviewCommand";
import CommandRouter from "./CommandRouter";
import OpenAI from "openai";
import type SlashCommandHandler from "./commands/SlashCommandHandler";
import ReviewService from "./services/ReviewService";
import dotenv from "dotenv";
import { registerEventHandlers } from "./events";

// Load environment variables from .env file, mostly for development
dotenv.config();

function buildCommands(
  config: ConfigType,
  openaiClient: OpenAI
): SlashCommandHandler[] {
  const reviewService = new ReviewService(
    openaiClient,
    config.OPENAI_MODEL,
    config.SYSTEM_PROMPT
  );
  const reviewCommand = new ReviewCommand(reviewService);

  return [reviewCommand];
}

async function main() {
  const config = getConfigFromEnv();

  // Update logger level from config
  logger.info("Setting log level to", config.LOG_LEVEL);
  logger.level = config.LOG_LEVEL;

  const client = new Client({
    intents: GatewayIntentBits.Guilds,
  });

  // Need to set the token before we can register commands, client's rest token
  // is only set after login
  const rest = client.rest.setToken(config.DISCORD_TOKEN);

  logger.info("Creating OpenAI client...");
  const openaiClient = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_BASE_URL,
  });

  logger.info("Registering commands...");

  // Register commands in router
  const commands = buildCommands(config, openaiClient);
  const commandRouter = new CommandRouter(config.DISCORD_CLIENT_ID, commands);

  // Register commands with Discord API
  await commandRouter.registerCommands(rest);
  // Event handlers
  registerEventHandlers(client, commandRouter);

  logger.info("Starting Discord client...");

  // Start client, connect to Discord gateway and listen for events
  await client.login(config.DISCORD_TOKEN);
}

main().catch((error) => {
  logger.error(error, "An error occurred starting the bot");
});
