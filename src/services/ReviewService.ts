import fetch from "node-fetch";
import OpenAI from "openai";

import type { RequestOptions } from "openai/core";
import type { APIPromise } from "openai/core";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/chat/completions";
import baseLogger from "../logger";

const logger = baseLogger.child({ module: "ReviewService" });

// Match expected OpenAI client interface with only the methods we use in the
// ReviewService. We don't need streaming, as we need the full response to be
// able to return the completion content.
export interface OpenAIClient {
  chat: {
    completions: {
      create(
        body: ChatCompletionCreateParamsNonStreaming,
        options?: RequestOptions
      ): APIPromise<ChatCompletion>;
    };
  };
}

class ReviewService {
  // TODO: google docs
  // private docsAPIKey: string;

  private openaiClient: OpenAIClient;
  private model: string;
  private systemPrompt: string;

  constructor(openaiClient: OpenAIClient, model: string, systemPrompt: string) {
    this.openaiClient = openaiClient;
    this.model = model;
    this.systemPrompt = systemPrompt;
  }

  async getDocContent(url: string): Promise<string> {
    // TODO: Implement me

    return url;
  }

  async getCompletion(userContent: string): Promise<string> {
    const response = await this.openaiClient.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: this.systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    logger.debug({ response }, "OpenAI response");

    if (response.choices.length === 0) {
      throw new Error("No choices in response from OpenAI");
    }

    const data = response.choices[0];

    if (!data.message.content) {
      throw new Error("Empty content in response from OpenAI");
    }

    return data.message.content;
  }
}

export default ReviewService;
