const Discord = require('discord.js');
const client = new Discord.Client();
const watchedNames = process.env.WATCHED_NAMES.split(',').map((v) => v.trim());
const GUILD_ID = process.env.DISCORD_GUILD_ID;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const getPlayingWatchedUsers = () => {
  const [, guild] = [...client.guilds.cache].find(([id]) => id == GUILD_ID);
  const presences = [...guild.presences.cache].map(([, presence]) => presence);
  const watchedPresences = presences.filter((presence) =>
    watchedNames.includes(presence.user.username)
  );
  const playingWacthedPresences = watchedPresences.filter(
    (p) => !!p.activities.find(isPlayingActivity)
  );
  return playingWacthedPresences.map((p) => ({
    userName: p.user.username,
    gameName: p.activities.find(isPlayingActivity).name,
  }));
};

const getWatchedPlayersPlayingGame = (game) =>
  getPlayingWatchedUsers()
    .filter(({ gameName }) => gameName === game)
    .map(({ userName }) => userName);

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

  if (startedPlaying) {
    safeCall(
      playerStartGameHandler,
      current.user.username,
      recentGameActivity.name,
      getWatchedPlayersPlayingGame(recentGameActivity.name)
    );
  }
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
