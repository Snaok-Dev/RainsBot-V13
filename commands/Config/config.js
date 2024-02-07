const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, data) => {
    const embed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setDescription('Configuration actuelle du serveur ' + message.guild.name)
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: "`🌐` Général", value: `Préfixe: \`${data.prefix}\``, inline: true },
            { name: "`🛡️` Protection", value: `Raidmode: \`${data.plugins.protection.raidmode ? "Activé" : "Désactivé"}\` \n` + `Anti-give-role: \`${data.plugins.protection.antigiverole ? "Activé" : "Désactivé"}\` \n` + `Antiban: \`${data.plugins.protection.antiban ? "Activé" : "Désactivé"}\` \n` + `Antilien: \`${data.plugins.protection.antilink ? "Activé" : "Désactivé"}\``},
            { name: "`👋` Message de bienvenue", value: `Activé: \`${data.plugins.welcome.enabled ? "Oui" : "Non"}\` \nMessage: \`${data.plugins.welcome.message}\` \nSalon: ${data.plugins.welcome.channel ? '<#' + data.plugins.welcome.channel + '>' : "`MP`"}`, inline: false },
            { name: "`💔` Message d\'aurevoir", value: `Activé: \`${data.plugins.goodbye.enabled ? "Oui" : "Non"}\` \nMessage: \`${data.plugins.goodbye.message}\` \nSalon: ${data.plugins.goodbye.channel ? '<#' + data.plugins.goodbye.channel + '>' : "`MP`"}`, inline: false },
            { name: "`⚒️` Modération", value: `\`Activé: ${data.plugins.logs.enabled ? "Oui" : "Non"}\` \nSalon de logs: ${data.plugins.logs.channel ? '<#' + data.plugins.logs.channel + '>' : "Aucun"}`, inline: false },
            { name: "`💡` Modération", value: `Activé: ${data.plugins.suggestion.enabled ? "Oui" : "Non"} \nSalon: ${data.plugins.suggestion.channel ? '<#' + data.plugins.suggestion.channel + '>' : "Aucun"}`, inline: false },      
        )
        .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
        message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "config",
    aliases: ["config"],
    category: 'Config',
    description: "Vérifier les paramètres de configuration du serveur",
    usage: "",
    cooldown: 5,
    memberPerms: ["MANAGE_GUILD"],
    botPerms: ["EMBED_LINKS"],
    args: false
}