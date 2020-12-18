const fetch = require('node-fetch');
const FLOOD_LIMIT = 60 * 60 * 1000;

function TelegramSender(token, chatId) {
  this.token = token;
  this.chatId = chatId;
  this.messageHistory = [];
}

TelegramSender.prototype = {
  isFlood(key) {
    const now = Date.now();
    this.messageHistory = this.messageHistory.filter(
      ({ time }) => now - time < FLOOD_LIMIT
    );
    return this.messageHistory.some((m) => m.key === key);
  },
  registerMessage(key) {
    this.messageHistory.push({ key, time: Date.now() });
  },
  sendMessage(content, key) {
    if (this.isFlood(key)) return;

    this.registerMessage(key);
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
