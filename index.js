require('dotenv').config();
const {
  onPlayerStartGame,
  onPlayerLoggedInWhileGaming,
  login,
} = require('./modules/discord');
const { sendMessage } = require('./modules/telegram');

const counts = [
  '🙅',
  '🙋🏻‍♂️',
  '👬',
  '👨‍👧‍👦',
  '👨‍👨‍👦‍👦',
  '👨‍👨‍👦‍👦🤦‍♂️',
  '👨‍👦‍👦👨‍👦‍👦',
  '👨‍👨‍👦‍👦👨‍👦‍👦',
  '👨‍👨‍👦‍👦👨‍👨‍👦‍👦',
  '🏟',
  '🏟',
  '🏟',
  '🏟',
];

onPlayerStartGame((userName, gameName, allPlayerNames) => {
  sendMessage(
    `<b>${userName}</b> 🎮 ${gameName} (${counts[allPlayerNames.length]})`
  );
});

login();
