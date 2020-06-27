const fetch = require('node-fetch');

const sendMessage = (content) => {
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
