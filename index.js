require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
const PORT = 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log('Bot hazır!');
  console.log(`${client.user.tag} olarak giriş yapıldı`);
});

client.on('guildMemberAdd', async (member) => {
  const roleId = process.env.ROLE_ID;
  
  if (!roleId) {
    console.error('ROLE_ID environment variable tanımlanmamış!');
    return;
  }

  try {
    const role = member.guild.roles.cache.get(roleId);
    
    if (!role) {
      console.error(`Rol bulunamadı: ${roleId}`);
      return;
    }

    await member.roles.add(role);
    console.log(`${member.user.tag} kullanıcısına ${role.name} rolü verildi`);
  } catch (error) {
    console.error('Rol verme hatası:', error);
  }
});

app.get('/', (req, res) => {
  res.send('Bot çalışıyor!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web sunucu ${PORT} portunda çalışıyor`);
});

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('BOT_TOKEN environment variable tanımlanmamış!');
  process.exit(1);
}
// Basit durum kontrol komutu
client.on('messageCreate', (message) => {
  // Bot kendi mesajına cevap vermesin
  if (message.author.bot) return;

  // Eğer kullanıcı "!durum" yazarsa
  if (message.content === '!durum') {
    message.channel.send('✅ Bot aktif ve çalışıyor!');
  }
});
client.login(token);
