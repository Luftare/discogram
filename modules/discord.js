const Discord = require('discord.js');
const client = new Discord.Client();
const watchedNames = process.env.WATCHED_NAMES.split(',').map((v) => v.trim());
const secondaryWatchedNames = process.env.WATCHED_NAMES2.split(',').map((v) =>
  v.trim()
);
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
      new Date(b.timestamps.start).getTime() -
      new Date(a.timestamps.start).getTime()
  )[0];

const isPlayingActivity = (a) => a.type === 'PLAYING';

const startedNewGame = (previousActivities, recentGameActivity) =>
  !previousActivities.find(
    (previousActivity) => previousActivity.name === recentGameActivity.name
  );

client.on('presenceUpdate', (previous, current) => {
  const isPrimaryPlayer = watchedNames.includes(current.user.username);
  const isSecondaryPlayer = secondaryWatchedNames.includes(
    current.user.username
  );
  if (!isPrimaryPlayer && !isSecondaryPlayer) return;

  if (!previous || !current)
    return console.log('DISCORD ABORTING: previous or current state missing');

  const currentActivities = [...current.activities];
  const previousActivities = [...previous.activities];

  const playingActivities = currentActivities.filter(isPlayingActivity);

  const recentGameActivity = toLatestActivity(playingActivities);

  if (!recentGameActivity)
    return console.log('DISCORD ABORTING: no recent game activity');

  const startedPlaying = startedNewGame(previousActivities, recentGameActivity);

  if (startedPlaying) {
    playerStartGameHandler(
      [isPrimaryPlayer, isSecondaryPlayer],
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
