const { MessageEmbed } = require('discord.js');
const botinfos = require('../../package.json');

module.exports.run = async (client, message, args, data, userData) => {

    const botinfoEmbed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({ name: `Infos de ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        .setDescription(botinfos.description)
        .addFields(
            { name: '\\📥 Serveurs', value: client.guilds.cache.size.toString(), inline: true },
            { name: '\\👥 Utilisateurs', value: client.users.cache.size.toString(), inline: true },
            { name: '\\💬 Salons', value: client.channels.cache.size.toString(), inline: true },
            { name: '\\🆚 Version', value: botinfos.version.toString(), inline: true },
            { name: '\\⌚ Uptime', value: `${Math.floor(client.uptime / (1000 * 60 * 60 * 24))}j ${Math.floor((client.uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h ${Math.floor((client.uptime % (1000 * 60 * 60)) / (1000 * 60))}m ${Math.floor((client.uptime % (1000 * 60)) / 1000)}s`.toString(),  inline: true },
            { name: '\\📟 Mémoire', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`.toString(), inline: true },
            { name: "\\🖥️ Commandes", value: client.commands.size.toString(), inline: true },
            { name: "\\📝 GitHub", value: "[RainsBot](https://github.com/COCO150/RainsBot)", inline: true },
            { name: '\\👑 Développeur', value: client.config.owner.name.toString(), inline: true },
            { name: "\\🖇️ Lien d'invitation", value: "[Clique ici](https://discord.com/api/oauth2/authorize?client_id=1059535400009470053&permissions=8&scope=bot)", inline: true },
            { name: "\\🔗 Support", value: "[Clique ici](https://discord.gg/EGgMGZQgqs)", inline: true },
        )
        .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})

    message.channel.send({ embeds: [botinfoEmbed] });
}

module.exports.help = {
    name: "botinfo",
    aliases: ["botinfo", "bi", "botinfos", "infobot", "infosbot", "bot-info", "bot-infos"],
    category: "General",
    description: "Afficher des informations à propos du bot",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}
