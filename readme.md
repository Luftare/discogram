# Discogram

Announce when someone starts playing a game.

## Setup

Create `.env` file to the module root with following content filled with corresponding details.

```
DISCORD_TOKEN=
DISCORD_GUILD_ID=
TELEGRAM_TOKEN=
TELEGRAM_CHANNEL_ID=
WATCHED_NAMES=Some discord user name, other, separated by comma
TELEGRAM_TOKEN2=
TELEGRAM_CHANNEL_ID2=
WATCHED_NAMES2=Some discord user name, other, separated by comma
```

Telegram with 2 in the end fields allow second chat group to receive subset of player statuses.

## FAQ

### How to get channel id?

1. Create telegram bot
2. Add Telegram bot to channel
3. Send message to the channel
4. visit https://api.telegram.org/bot<-token-here->/getUpdates
