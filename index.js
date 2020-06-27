require('dotenv').config();
const {
  onPlayerStartGame,
  onPlayerLoggedInWhileGaming,
  login,
} = require('./modules/discord');
const { sendMessage } = require('./modules/telegram');

onPlayerStartGame((userName, gameName) => {
  sendMessage(`<b>${userName}</b> 🎮 ${gameName}`);
});

login();
