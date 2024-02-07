const { MessageEmbed } = require("discord.js");

module.exports = async (client, guild) => {
    const newGuildEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })})
        .setDescription(`J'ai rejoint le serveur ${guild.name} ! Je suis maintenant dans **` + client.guilds.cache.size + `** serveurs !`)
        .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
    client.channels.cache.get(client.config.support.logs).send({ embeds: [newGuildEmbed] });
}