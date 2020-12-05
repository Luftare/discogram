require('dotenv').config();

const {
  onPlayerStartGame,
  onPlayerLoggedInWhileGaming,
  login,
} = require('./modules/discord');
const { sendMessage } = require('./modules/telegram');

onPlayerStartGame((channels, userName, gameName, allPlayerNames) => {
  sendMessage(
    channels,
    `${allPlayerNames
      .map((name) => (name === userName ? `<b>${name}</b>` : name))
      .join(', ')} 🎮 ${gameName}`
  );
});

login();
