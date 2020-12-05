const fetch = require('node-fetch');
const FLOOD_LIMIT = 10 * 60 * 1000;

let messageHistory = [];

const tokens = [process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_TOKEN2];
const chatIds = [process.env.TELEGRAM_CHAT_ID, process.env.TELEGRAM_CHAT_ID2];

const registerMessage = (content) => {
  const now = Date.now();
  messageHistory.push({ content, time: now });
  messageHistory = messageHistory.filter(
    ({ time }) => now - time < FLOOD_LIMIT
  );
};

const isFlood = (content) =>
  !!messageHistory.find((m) => m.content === content);

const sendMessage = (channels, content) => {
  if (isFlood(content)) return;

  registerMessage(content);

  console.log(`SENDING TO TELEGRAM: ${content}`);

  channels.forEach((isIncluded, index) => {
    if (!isIncluded) {
      return;
    }
    fetch(`https://api.telegram.org/bot${tokens[index]}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatIds[index],
        text: content,
        disable_notification: false,
        parse_mode: 'html',
      }),
    });
  });
};

module.exports = {
  sendMessage,
};
