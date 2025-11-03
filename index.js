require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const axios = require('axios'); // <-- Anti-sleep için eklendi

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent, // !durum komutu için gerekli
  ],
});

client.once('ready', () => {
  console.log('✅ Bot hazır!');
  console.log(`${client.user.tag} olarak giriş yapıldı`);
});

// Yeni üye girdiğinde otomatik rol verme
client.on('guildMemberAdd', async (member) => {
  const roleId = process.env.ROLE_ID;
  if (!roleId) return console.error('ROLE_ID environment variable tanımlanmamış!');

  try {
    const role = member.guild.roles.cache.get(roleId);
    if (!role) return console.error(`Rol bulunamadı: ${roleId}`);

    await member.roles.add(role);
    console.log(`🎉 ${member.user.tag} kullanıcısına ${role.name} rolü verildi`);
  } catch (err) {
    console.error('Rol verme hatası:', err);
  }
});

// Basit durum kontrol komutu
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!durum') {
    message.channel.send('✅ Bot aktif ve çalışıyor!');
  }
});

// Web sunucusu (Render port kontrolü için)
app.get('/', (req, res) => {
  res.send('Bot çalışıyor! 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Web sunucu ${PORT} portunda çalışıyor`);
});

// Anti-sleep mekanizması
setInterval(() => {
  axios
    .get('https://discord-autorole-bot-ijh8.onrender.com/')
    .then(() => console.log('♻️ Anti-sleep ping gönderildi'))
    .catch(() => console.log('⚠️ Anti-sleep ping başarısız'));
}, 5 * 60 * 1000); // Her 5 dakikada bir kendi sitesine ping at

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN environment variable tanımlanmamış!');
  process.exit(1);
}

client.login(token);
