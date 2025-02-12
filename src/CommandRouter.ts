import {
  ChatInputCommandInteraction,
  Routes,
  type REST,
  type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import type SlashCommandHandler from "./commands/SlashCommandHandler";
import parentLogger from "./logger";

const logger = parentLogger.child({ module: "CommandRouter" });

export default class CommandRouter {
  discordClientID: string;
  commands: Map<string, SlashCommandHandler>;

  constructor(discordClientID: string, commands: SlashCommandHandler[]) {
    this.discordClientID = discordClientID;
    this.commands = new Map(commands.map((c) => [c.command.name, c]));
  }

  private getCommandsArray(): RESTPostAPIApplicationCommandsJSONBody[] {
    const slashCmds = Array.from(this.commands.values()).map((c) => c.command);

    return slashCmds;
  }

  async registerCommands(rest: REST) {
    const data = await rest.put(
      Routes.applicationCommands(this.discordClientID),
      {
        body: this.getCommandsArray(),
      }
    );

    logger.info(data, "Successfully registered application commands");
  }

  async handleInteraction(interaction: ChatInputCommandInteraction) {
    const command = this.commands.get(interaction.commandName);
    if (!command) {
      logger.warn(
        `Command not found: ${interaction.commandName}, ignoring. Please register the command with CommandRouter.`
      );
      return;
    }

    try {
      await command.handler(interaction);
    } catch (error) {
      logger.error(error, `Error handling command: ${interaction.commandName}`);
    }
  }
}
