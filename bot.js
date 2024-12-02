// bot.js
const TelegramBot = require('node-telegram-bot-api');
const token = '7674276431:AAH0pV5tSId5qQRflUfcE-SQ0Lzlel5LYZg';  // Thay bằng token bot của bạn
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Click the button to launch the app inside Telegram!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Launch App", web_app: { url: "https://paws-gepp4ekuh-quocs-projects-64d1821c.vercel.app/" } }
        ]
      ]
    }
  });
});
