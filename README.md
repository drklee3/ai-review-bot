# Writer AI Review Bot

Outgoing webhooks based Discord bot to review technical writing eLearning
scripts from Google Docs, using an OpenAI compatible model.

## Commands

`/review <google-doc-url>` - Review the Google Doc at the provided URL.

## Requirements

1. Discord bot token and client ID.
2. OpenAI compatible API key and base url.
3. Google docs API key.

## Configuration

Configuration is set with environment variables. All are required, except for
`LOG_LEVEL`.

```env
LOG_LEVEL=debug
DISCORD_TOKEN=xxx
DISCORD_CLIENT_ID=xxx
OPENAI_API_KEY=xx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
SYSTEM_PROMPT="
Multi-line system prompts
can
go
here
"
```

## Development

Install [Bun](https://bun.sh/).

```bash
# Install dependencies
bun install

# Start the bot
bun dev
```
