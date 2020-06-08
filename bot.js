const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require("quick.db");
const ms = require('ms');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};



client.on('ready', () => {

// Oynuyor Kısmı

    var actvs = [
      `${prefix}yardım ${client.guilds.cache.size} sunucuyu`,
      `${prefix}yardım ${client.users.cache.size} Kullanıcıyı`, 
      `${prefix}yardım`
  ];
  
  client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING' });
  setInterval(() => {
      client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING'});
  }, 3000);
  

// Konsola Sunucuları , Botun İsmini, Kaç Kişi Kullanıyor Botu, Prefix'ini Gösterir

    console.log ('_________________________________________');
    console.log (`Kullanıcı İsmi     : ${client.user.username}`);
    console.log (`Sunucular          : ${client.guilds.cache.size}`);
    console.log (`Kullanıcılar       : ${client.users.cache.size}`);
    console.log (`Prefix             : ${ayarlar.prefix}`);
    console.log (`Durum              : Hazır!`);
    console.log ('_________________________________________');
  
  });


  client.on('message', async message => {
    var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
    var args = message.content.split(' ').slice(1);

// Bot'a Özelden Komut Yazmasını Engeller.

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


// Burayada Örnek Olarak Bu Şekilde Komut Oluşturabilirsiniz.
//if(command === 'deneme') {
//  message.reply("Deneme")
//}



});

client.login(ayarlar.token);