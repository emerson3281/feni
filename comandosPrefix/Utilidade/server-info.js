const Discord = require("discord.js");

module.exports = {
    name: "server-info",
    description: "｢Utilidade｣ Veja as informações do servidor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let membros = interaction.guild.memberCount;
        let cargos = interaction.guild.roles.cache.size;
        let canais = interaction.guild.channels.cache.size;
        let entrou = interaction.guild.joinedTimestamp;
        let servidor = interaction.guild;
        let donoid = interaction.guild.ownerId;
        let emojis = interaction.guild.emojis.cache.size;
        let serverid = interaction.guild.id
        let boosts = interaction.guild.premiumSubscriptionCount;
        let data = interaction.guild.createdAt.toLocaleDateString("pt-br");


        let embed = new Discord.EmbedBuilder()
            .setColor("Blue")
            .setThumbnail(interaction.guild.iconURL({ dinamyc: true, format: "png", size: 4096 }))
            .setTitle(`Informações do servidor: ${interaction.guild}`)
            .addFields(
                {
                    name: `Dono`,
                    value: `\n\`\`${donoid}\`\``,
                    inline: true,
                },
                {
                    name: `Identidade`,
                    value: `\`\`\`${serverid}\`\`\``,
                    inline: true,
                },
                {
                    name: `Canais em geral:`,
                    value: `Canais: ${canais}\n Cargos: ${cargos}\n emojis ${emojis}`,
                    inline: true,
                },
                {
                    name: `Usuarios`,
                    value: `\`\`\`${membros} membros\`\`\``,
                    inline: true,
                },
                {
                    name: `Servidor criado`,
                    value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}>`,
                    inline: true,
                },
                {
                    name: `🚀 ${interaction.user.username} entrou em `,
                    value: `<t:${parseInt(servidor.joinedTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: `**${process.env.nitrobooster} Total de Boosts:**`,
                    value: `\`\`\`${boosts} boosts\`\`\``,
                    inline: true
                },
            )

        interaction.reply({ embeds: [embed] })
    }
}