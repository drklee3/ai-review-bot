import { z } from "zod";

const configSchema = z.object({
  LOG_LEVEL: z.string().optional().default("info"),

  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),

  // GOOGLE_DOCS_API_KEY: z.string(),

  OPENAI_API_KEY: z.string(),
  OPENAI_BASE_URL: z.string().optional(),
  OPENAI_MODEL: z.string(),

  SYSTEM_PROMPT: z.string(),
});

export type ConfigType = z.infer<typeof configSchema>;

export function getConfigFromEnv(): ConfigType {
  const config = configSchema.safeParse(process.env);

  if (!config.success) {
    throw new Error(`Invalid environment variables: ${config.error}`);
  }

  return config.data;
}
