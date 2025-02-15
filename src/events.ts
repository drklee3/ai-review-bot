import type { Client } from "discord.js";
import type CommandRouter from "./CommandRouter";
import parentLogger from "./logger";

const logger = parentLogger.child({ module: "events" });

export function registerEventHandlers(client: Client, router: CommandRouter) {
  client.once("ready", () => {
    logger.info(`Bot is online! ${client.user?.tag}`);
    // https://discord.com/oauth2/authorize?client_id=1111130119566790758&permissions=563362270660672&integration_type=0&scope=applications.commands+bot

    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user?.id}&permissions=563362270660672&integration_type=0&scope=applications.commands+bot`;
    logger.info(`Invite link: ${inviteLink}`);
  });

  client.on("guildCreate", (guild) => {
    logger.info(`Joined server: ${guild.name}`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      logger.warn("Received non-command interaction");

      return;
    }

    try {
      await router.handleInteraction(interaction);
    } catch (error) {
      logger.error(`Error handling command: ${interaction.commandName}`, error);
    }
  });
}
