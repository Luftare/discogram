require('dotenv').config();
const {
  onPlayerStartGame,
  onPlayerLoggedInWhileGaming,
  login,
} = require('./modules/discord');
const { sendMessage } = require('./modules/telegram');

onPlayerStartGame((userName, gameName, allPlayerNames) => {
  sendMessage(
    `<b>${userName}</b> 🎮 ${gameName} (${allPlayerNames.map(() => '🕹').join('')]})`
  );
});

login();
