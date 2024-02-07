const { MessageEmbed } = require("discord.js");
const emojis = require('../../emojis');
const moment = require('moment');

module.exports.run = (client, message) => {
    if (!message.guild.available) return;

    let guild = message.guild;

    let guildNotifications = guild.defaultMessageNotifications;

    if (guildNotifications == "ALL") guildNotifications = 'Tous les messages';
    if (guildNotifications == "MENTIONS") guildNotifications = 'Mentions uniquement';

    let guildVerificationLevel = guild.verificationLevel;
    switch (guildVerificationLevel) {
        case "NONE":
            guildVerificationLevel = 'Aucune restriction';
            break;
        case "LOW":
            guildVerificationLevel = 'Faible - Doit avoir une adresse e-mail vérifiée sur son compte Discord.';
            break;
        case "MEDIUM":
            guildVerificationLevel = 'Moyen - Doit aussi être inscrit sur Discord depuis plus de 5 minutes.';
            break;
        case "HIGH":
            guildVerificationLevel = 'Élevé - Doit aussi être un membre de ce serveur depuis plus de 10 minutes.';
            break;
        case "VERY_HIGH":
            guildVerificationLevel = 'Maximum - Doit avoir un numéro de téléphone vérifié sur son compte Discord.';
            break;
    };

    const embed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })})
        .addFields(
            { name: "\\🏷️ Nom", value: guild.name, inline: true },
            { name: "\\👑 Propriétaire", value: guild.members.cache.find(u => u.id === guild.ownerID).user.tag.toString(), inline: true },
            { name: "\\🆕 Créé le", value: moment(guild.createdAt).locale("fr").format("llll"), inline: true },
            { name: "\\👨 Membres", value: `${guild.members.cache.filter(m => !m.user.bot).size} Humains | ${guild.members.cache.filter(m => m.user.bot).size} Bots\n\u200b`, inline: true },
            { name: "\\💬 Salons", value: `${guild.channels.cache.filter(ch => ch.type === "text").size} \\💭 | ${guild.channels.cache.filter(ch => ch.type === "voice").size} \\🗣️`, inline: true },
            { name: "\\🔮 Boosts", value: `${guild.premiumSubscriptionCount} boosts (Tier ${guild.premiumTier})`, inline: true },
            { name: "\\🔇 Salon AFK", value: guild.afkChannel ? guild.afkChannel.name : "Aucun", inline: true },
            { name: "\\🚩 Région", value: `${guild.region.charAt(0).toUpperCase()}${guild.region.substr(1).toLowerCase()}`, inline: true },
            { name: "\\💼 Partenaire", value: guild.partnered ? "Oui" : "Non", inline: true },
            { name: "\\🔔 Notifications", value: guildNotifications, inline: true },
            { name: "\\🔐 Niveau de vérification", value: guildVerificationLevel, inline: true },
        )   
        .setFooter({ text: client.config.embed.footer, iconURL: client.user.displayAvatarURL()})

    if (guild.description) embed.setDescription(guild.description);
    if (guild.bannerURL()) embed.setImage(guild.bannerURL({ format: "png", size: 512 }));

    message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "serverinfo",
    aliases: ["serverinfo", "si", "serverinfos", "infoserver", "infosserver", "server-info", "server-infos", "info-server", "infos-server", "serveurinfo", "serveurinfos", "infoserveur", "infosserveur", "serveur-info", "serveur-infos"],
    category: "General",
    description: "Voir des informations sur le serveur",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}
