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
GOOGLE_DOCS_API_KEY=xxx
OPENAI_API_KEY=xx
OPENAI_BASE_URL=xx
OPENAI_MODEL=gpt-4o
SYSTEM_PROMPT=xxx
```
