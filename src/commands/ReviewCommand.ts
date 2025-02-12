import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type SlashCommandHandler from "./SlashCommandHandler";
import type ReviewService from "../services/ReviewService";
import parentLogger from "../logger";

const logger = parentLogger.child({ module: "ReviewCommand" });

export default class ReviewCommand implements SlashCommandHandler {
  service: ReviewService;

  constructor(service: ReviewService) {
    this.service = service;
  }

  readonly command = new SlashCommandBuilder()
    .setName("review")
    .setDescription("Review a Google doc")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Link to the Google doc")
        .setRequired(true)
    )
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction) {
    const docUrl = interaction.options.getString("url", true);

    await interaction.reply({
      content: `Loading your doc!`,
    });

    const documentContent = await this.service.getDocContent(docUrl);

    await interaction.followUp({
      content: `Loaded your doc! It's ${documentContent.length} characters long. Let me review it for you...`,
    });

    let completion;
    try {
      completion = await this.service.getCompletion(documentContent);
    } catch (err) {
      logger.error(err, "Error getting completion");

      await interaction.followUp({
        content: `Sorry, I ran into an error trying to review your doc. Please try again later.`,
      });

      return;
    }

    await interaction.followUp({
      content: completion,
    });
  }
}
