const Discord = require("discord.js");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
"use strict";

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./comandosPrefix/`);

fs.readdirSync("./comandosPrefix/").forEach((local) => {
  const comandos = fs
    .readdirSync(`./comandosPrefix/${local}`)
    .filter((arquivo) => arquivo.endsWith(".js"));

  for (let file of comandos) {
    let puxar = require(`./comandosPrefix/${local}/${file}`);

    if (puxar.name) {
      client.commands.set(puxar.name, puxar);
    }
    if (puxar.aliases && Array.isArray(puxar.aliases))
      puxar.aliases.forEach((x) => client.aliases.set(x, puxar.name));
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === Discord.ChannelType.DM) return;

  const serverId = message.guild.id;
  const db = client.mongoClient.db("configs");
  const collection = db.collection("servers");

  try {
    const result = await collection.findOne({ server_id: serverId });

    if (result) {
      const prefix = result.custom_prefix || process.env.PREFIX;

      if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()))
        return;

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();

      if (cmd.length === 0) return;
      let command = client.commands.get(cmd);
      if (!command) command = client.commands.get(client.aliases.get(cmd));

      try {
        command.run(client, message, args);
      } catch (err) {
        console.error("Erro:" + err);
      }
    } else {
      const prefix = process.env.PREFIX;

      if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()))
        return;

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();

      if (cmd.length === 0) return;
      let command = client.commands.get(cmd);
      if (!command) command = client.commands.get(client.aliases.get(cmd));

      try {
        command.run(client, message, args);
      } catch (err) {
        console.error("Erro:" + err);
      }
    }
  } catch (error) {
    console.error("Erro ao consultar o banco de dados:", error);
  }
});

module.exports = client;

function getTotalMembers() {
  return client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
}

client.on("ready", () => {
  console.log(
    console.log(client.user.username + ' Está online e funcional!') //...
  );
  client.user.setStatus("online");
  let status = [
    {
      name: `💻${client.guilds.cache.size} Servidores`,
      type: Discord.ActivityType.Playing,
    },
    {
      name: `🎇${getTotalMembers()} Usuários`,
      type: Discord.ActivityType.Playing,
    },
    {
      name: "📌 Meu prefixo é: / ou !  (nunca se esqueça!)",
      type: Discord.ActivityType.Playing,
    },
    {
      name: "🎉Confira meu perfil no Top.gg",
      type: Discord.ActivityType.Playing,
    },
    {
      name: "📩 Com Dúvidas? Utilize comandos usando /ajuda.",
      type: Discord.ActivityType.Playing,
    },
  ];
  client.user.setActivity(status[0]);
  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 12000);
  //setTimeout(() => {
  //  const { AutoPoster } = require('topgg-autoposter')
  //  const ap = AutoPoster(process.env.TOP_GG_TOKEN, client)
  //  ap.on('posted', () => {
  //  })
  //}, 6000000);
});

process.on("multipleResolutions", (type, reason, promise) => {
  console.log(`🚫 Erro Detectado\n\n` + type, promise, reason);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n` + reason, promise);
});

process.on("uncaughtException", (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin);
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin);
});

fs.readdir("./eventos", (err, file) => {
  file.forEach((event) => {
    require(`./eventos/${event}`);
  });
});

client.slashCommands = new Discord.Collection();

require("./handler")(client);

client.login(process.env.DISCORD_TOKEN);

const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const clientMongo = new MongoClient(uri);

clientMongo
  .connect()
  .then(() => {
    console.log("\x1b[32m[ BANCO DE DADOS ] \x1b[0m> 🏡  Conectado ao Banco de Dados.");
  })
  .catch((error) => {
    console.error("Ocorreu um erro ao conectar ao MongoDB:", error);
  });

module.exports.mongoClient = clientMongo;
