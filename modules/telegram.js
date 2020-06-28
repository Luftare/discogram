const fetch = require('node-fetch');
const FLOOD_LIMIT = 10 * 60 * 1000;
let messageHistory = [];

const registerMessage = (content) => {
  const now = Date.now();
  messageHistory.push({ content, time: now });
  messageHistory = messageHistory.filter(
    ({ time }) => now - time < FLOOD_LIMIT
  );
};

const isFlood = (content) =>
  !!messageHistory.find((m) => m.content === content);

const sendMessage = (content) => {
  if (isFlood(content)) return;

  registerMessage(content);

  console.log(content);

  fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: content,
        disable_notification: false,
        parse_mode: 'html',
      }),
    }
  );
};

module.exports = {
  sendMessage,
};
