import type {
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export default abstract class SlashCommandHandler {
  /**
   * Data for command, e.g. the name, description, options
   */
  abstract readonly command:
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | RESTPostAPIApplicationCommandsJSONBody;

  /**
   * Field for the actual handler function
   */
  abstract handler(interaction: ChatInputCommandInteraction): Promise<void>;
}
