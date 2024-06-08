const Discord = require("discord.js")

module.exports = {
  name: "triggered",
  description: "｢Imagem｣ Aplica o efeito 'triggered' a uma imagem de perfil.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "usuário",
      description: "Usuário que deseja usar!",
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    let user = interaction.options.getUser("usuário");
    if (!user) {
      user = interaction.user;
    }
    let useravatar = user.displayAvatarURL();
    useravatar = useravatar.replace(/\.(jpg|jpeg|gif|png|webp)$/i, ".png");
    await interaction.deferReply();
    const fetch = await import('node-fetch');
    const response = await fetch.default(`https://some-random-api.com/canvas/overlay/triggered?avatar=${useravatar}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const attachment = new Discord.AttachmentBuilder(buffer, { name: "triggered.gif" })

    let embed = new Discord.EmbedBuilder()
    .setColor("Random")
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setImage("attachment://triggered.gif")
    .setTitle(`Aqui sua imagem de Triggered:`)
    .setFooter({ text: `Comando usado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

    await interaction.editReply({ files: [attachment], content: `<@${interaction.user.id}>`,embeds: [embed] })
  }
}