import {
  EmbedBuilder,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type SlashCommandHandler from "./SlashCommandHandler";
import type ReviewService from "../services/ReviewService";
import parentLogger from "../logger";

const logger = parentLogger.child({ module: "ReviewCommand" });

const attachmentOption = "file";

export default class ReviewCommand implements SlashCommandHandler {
  service: ReviewService;

  constructor(service: ReviewService) {
    this.service = service;
  }

  readonly command = new SlashCommandBuilder()
    .setName("review")
    .setDescription("Review a document for you")
    // Exercise left to the reader: Support fetching the doc content from a URL
    // Although file upload is more versatile.
    .addAttachmentOption((option) =>
      option
        .setName(attachmentOption)
        .setDescription("Upload a .txt file to review")
        .setRequired(true)
    )
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction) {
    const file = interaction.options.getAttachment(attachmentOption, true);

    logger.debug({ file }, "Received file upload");

    // text/plain, but might have more like "text/plain; charset=UTF-8-SIG"
    if (!file.contentType?.includes("text")) {
      await interaction.reply({
        content: "Please upload a .txt file",
      });

      return;
    }

    await interaction.reply({
      content: `Loading your doc!`,
    });

    let textContent;
    try {
      const res = await fetch(file.url);
      textContent = await res.text();
    } catch (err) {
      logger.error(err, "Error fetching file");

      await interaction.editReply({
        content: `Sorry, I ran into an error trying to fetch your doc. Please try again later.`,
      });

      return;
    }

    await interaction.editReply({
      content: `Loaded your doc! It's ${textContent.length} characters long. Let me review it for you...`,
    });

    let completion;
    try {
      completion = await this.service.getCompletion(textContent);
    } catch (err) {
      logger.error(err, "Error getting completion");

      await interaction.editReply({
        content: `Sorry, I ran into an error trying to review your doc. Please try again later.`,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Review Results")
      .setDescription(completion)
      .setColor("#714b67")
      .toJSON();

    await interaction.editReply({
      // Clear previous message
      content: "",
      // Include the review results as an embed
      embeds: [embed],
    });
  }
}
