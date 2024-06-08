const Discord = require("discord.js");
const {  EmbedBuilder } = require('discord.js');

module.exports = {
    name: "avatar",
    description: "｢Utilidade｣ Ver avatar do usuario",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client , interaction) => {
        const member = interaction.options.getMember('user') || interaction.user;

        const avatar = member.displayAvatarURL({ size: 1024, dynamic: true })

        const embed = new EmbedBuilder()
            .setTitle('🖼️ Avatar')
            .setColor('White')
            .setTimestamp()
            .setImage(avatar)

        interaction.reply({
            embeds: [embed],
          
        })
    }
}