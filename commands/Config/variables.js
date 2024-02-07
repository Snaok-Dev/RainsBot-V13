const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message) => {

    if (!client.config.embed) return console.error("Configuration des embeds introuvable.");

    const embed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription('Voici les variables disponibles que vous pouvez utiliser sur le message de bienvenue et d\'aurevoir : \n\n**{user}** ➔ Mentionner le membre \n**{username}** ➔ Nom d\'utilisateur du membre \n**{usertag}** ➔ Tag (nom d\'utilisateur + discriminateur) du membre \n**{guildName}** ➔ Nom du serveur \n**{memberCount}** ➔ Nombre de membres sur le serveur')
        .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})

    message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "variables",
    aliases: ["variables", "variable", "var", "vars"],
    category: 'Config',
    description: "Voir les variables disponibles pour le message de bienvenue et d'aurevoir",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
};
