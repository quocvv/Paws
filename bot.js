const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');  // Đảm bảo cài đặt axios để gửi HTTP requests
const token = '7674276431:AAH0pV5tSId5qQRflUfcE-SQ0Lzlel5LYZg';  // Thay bằng token bot của bạn
const bot = new TelegramBot(token, { polling: true });

// Hàm lấy giá của token từ CoinGecko API
async function getTokenPrice(tokenId) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    if (response.data[tokenId]) {
      return response.data[tokenId].usd;
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Hello! Welcome to the bot. Click the button to launch the app inside Telegram!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Launch App", web_app: { url: "https://paws-gepp4ekuh-quocs-projects-64d1821c.vercel.app/" } }
        ]
      ]
    }
  });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'This is a simple bot. Use /start to begin interacting with it!');
});

// Lệnh để lấy giá của token (ví dụ: Solana hoặc PAWS)
bot.onText(/\/price/, async (msg) => {
  const chatId = msg.chat.id;
  const tokenPrice = await getTokenPrice('solana');  // Hoặc 'paws-token' nếu PAWS có mặt trên CoinGecko

  if (tokenPrice) {
    bot.sendMessage(chatId, `The current price of SOL is $${tokenPrice} USD.`);
  } else {
    bot.sendMessage(chatId, 'Sorry, I could not fetch the price at this time.');
  }
});

// Lệnh để tính giá trị của token theo số lượng nhập vào
bot.onText(/val (\d+)\s*(\w+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = parseFloat(match[1]);  // Số lượng token
  const token = match[2].toLowerCase();  // Tên token (ví dụ: sol, paws)

  if (amount && token) {
    const tokenPrice = await getTokenPrice(token);  // Lấy giá của token

    if (tokenPrice) {
      const totalValue = amount * tokenPrice;
      bot.sendMessage(chatId, `The price of ${amount} ${token.toUpperCase()} is $${totalValue.toFixed(2)} USD.`);
    } else {
      bot.sendMessage(chatId, `Sorry, I could not fetch the price for the token ${token.toUpperCase()}.`);
    }
  } else {
    bot.sendMessage(chatId, 'Invalid format. Use: val <amount> <token> (e.g., val 1 sol)');
  }
});

// Chào hỏi người dùng khi gửi bất kỳ tin nhắn nào không phải là lệnh
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === '/start' || text === '/help' || text === '/price') {
    return;  // Không trả lời khi là lệnh
  }

  // Chào hỏi với tên người dùng
  const firstName = msg.from.first_name || 'there';
  bot.sendMessage(chatId, `Hi ${firstName}! How can I assist you today? Use /help for commands.`);
});

bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'I received an image! Thanks!');
});
