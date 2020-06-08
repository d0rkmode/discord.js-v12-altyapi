const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");
var p = ayarlar.prefix

exports.run = async (client, message, args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


    if(message.member.hasPermission("ADMINISTRATOR")) {
      let erk = db.fetch(`erk_${message.guild.id}`)
        let member = message.mentions.members.first();
        let isim = args.slice(1,2).join("");
        let yas = args.slice(2,3).join("");
        
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(`Hatalı Komut`, client.user.displayAvatarURL())
        .setDescription(`Örnek Kullanım: ${p}erkek @İmmortal Mert 20`)

        if (!member) return message.channel.send(embed2);
        if (!isim) return message.channel.send(embed2);
        if (!yas) return message.channel.send(embed2);
        member.setNickname(`${isim} | ${yas}`);
        
        member.roles.add(erk) //Bunu Alt Alta Koyarak İstediğiniz Kadar Rol Verebilirsiniz Kayıt Yaparken
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Kayıt Sistemi`, client.user.displayAvatarURL())
        .setDescription(`${message.author.username} Adlı Yetkili Tarafından ${member}  Adlı Kişiye Erkek Rolü Verildi`)
        message.channel.send(embed)
        }else{
          message.author.send("Bu Komutu Sadece **Yönetici** Yetkisi Olanlar Erişebilir!")
        }


}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,

};

exports.help = {
  name: 'erkek',
  description: '',
  usage: '',
 
};