require('dotenv').config();

const { onPlayerStartGame, login } = require('./modules/discord');
const { TelegramSender } = require('./modules/telegram');

const senders = [
  new TelegramSender(process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_CHAT_ID),
  new TelegramSender(
    process.env.TELEGRAM_TOKEN2,
    process.env.TELEGRAM_CHAT_ID2
  ),
];

onPlayerStartGame((channels, channelsPlayerNames, userName, gameName) => {
  channels.forEach((isActive, channelIndex) => {
    if (!isActive) return;
    const sender = senders[channelIndex];
    const allPlayerNames = channelsPlayerNames[channelIndex];

    sender.sendMessage(
      `${allPlayerNames
        .map((name) => (name === userName ? `<b>${name}</b>` : name))
        .join(', ')} 🎮 ${gameName}`
    );
  });
});

login();
