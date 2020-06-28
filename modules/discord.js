const Discord = require('discord.js');
const client = new Discord.Client();
const watchedNames = process.env.WATCHED_NAMES.split(',').map((v) => v.trim());

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const toLatestActivity = (activities) =>
  [...activities].sort(
    (a, b) =>
      new Date(b.timeStamps.start).getTime() -
      new Date(a.timeStamps.start).getTime()
  )[0];

const isPlayingActivity = (a) => a.type === 'PLAYING';

const startedNewGame = (previousActivities, recentGameActivity) =>
  !previousActivities.find(
    (previousActivity) => previousActivity.name === recentGameActivity.name
  );

const safeCall = (fn, ...args) => fn && fn(...args);

client.on('presenceUpdate', (previous, current) => {
  if (!watchedNames.includes(current.user.username)) return;
  if (!previous || !current) return;

  const currentActivities = [...current.activities];
  const previousActivities = [...previous.activities];

  const recentGameActivity = toLatestActivity(
    currentActivities.filter(isPlayingActivity)
  );
  if (!recentGameActivity) return;

  const startedPlaying = startedNewGame(previousActivities, recentGameActivity);

  safeCall(
    playerStartGameHandler,
    current.user.username,
    recentGameActivity.name
  );
});

let playerStartGameHandler = null;

module.exports = {
  onPlayerStartGame(handler) {
    playerStartGameHandler = handler;
  },
  login() {
    client.login(process.env.DISCORD_TOKEN);
  },
};
