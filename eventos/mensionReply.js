require('../index.js')

const Discord = require("discord.js");
const client = require('../index')

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
  
    let mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]

      mencoes.forEach(element => {
        if (message.content === element) {
          message.channel.sendTyping();
    
          let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
            .setDescription(`${process.env.pipoca} Olá, ${message.author} utilize \`/ajuda\` para ver minha lista de comando, em comando slash \`${process.env.prefixs}\``)
            setTimeout(() => {
          message.reply({ embeds: [embed] })
        }, 500);
        }
      })
  })