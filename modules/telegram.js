const fetch = require('node-fetch');
const FLOOD_LIMIT = 10 * 60 * 1000;

function TelegramSender(token, chatId) {
  this.token = token;
  this.chatId = chatId;
  this.messageHistory = [];
}

TelegramSender.prototype = {
  isFlood(content) {
    !!this.messageHistory.find((m) => m.content === content);
  },
  registerMessage(content) {
    const now = Date.now();
    this.messageHistory.push({ content, time: now });
    this.messageHistory = this.messageHistory.filter(
      ({ time }) => now - time < FLOOD_LIMIT
    );
  },
  sendMessage(content) {
    if (this.isFlood(content)) return;

    this.registerMessage(content);
    console.log(`SENDING TO TELEGRAM ${this.chatId}: ${content}`);

    fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: this.chatId,
        text: content,
        disable_notification: false,
        parse_mode: 'html',
      }),
    });
  },
};

module.exports = {
  TelegramSender,
};
