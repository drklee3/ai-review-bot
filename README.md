# AI Document Review Bot

Discord bot to review uploaded documents with an OpenAI compatible model.

## Commands

`/review <file>`

## Requirements

1. Discord bot token and client ID.
2. OpenAI compatible API key and base url.

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
