import OpenAI from "openai";
import ReviewService, { type OpenAIClient } from "./ReviewService";
import { describe, beforeEach, it, expect, mock } from "bun:test";

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let mockFn: ReturnType<typeof mock>;

  beforeEach(() => {
    mockFn = mock();

    // Mock OpenAI client, avoid making real API calls
    const mockOpenAIClient: OpenAIClient = {
      chat: {
        completions: {
          create: mockFn,
        },
      },
    };

    const systemPrompt = `
    You are a professional technical writer.
    You are reviewing a Google doc.
    yada yada2
    `;

    const model = "gpt-4o";
    reviewService = new ReviewService(mockOpenAIClient, model, systemPrompt);
  });

  it("should return first choice message content", async () => {
    const responseContent = "meow meow meow";

    mockFn.mockResolvedValueOnce({
      choices: [{ message: { content: responseContent } }],
    });

    const response = await reviewService.getCompletion("hello there");

    expect(response).toBe(responseContent);
  });

  it("should throw an error if no choices are returned", async () => {
    mockFn.mockResolvedValueOnce({
      choices: [],
    });

    expect(reviewService.getCompletion("hello there")).rejects.toThrow(
      "No choices in response from OpenAI"
    );
  });

  it("should throw an error if choice message content is empty", async () => {
    mockFn.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    expect(reviewService.getCompletion("hello there")).rejects.toThrow(
      "Empty content in response from OpenAI"
    );
  });

  it("should handle different mock return values", async () => {
    mockFn.mockResolvedValueOnce({
      choices: [{ message: { content: "Another mocked response" } }],
    });

    const response = await reviewService.getCompletion("test input");

    expect(response).toBeDefined();
    expect(response).toBe("Another mocked response");
  });

  // Add more tests as needed
});
