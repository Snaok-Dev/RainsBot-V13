const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message) => {
    const embed = new MessageEmbed()
        .setColor('#2F3136')
        .setDescription(`Clique [ici](https://discord.com/api/oauth2/authorize?client_id=1059535400009470053&permissions=8&scope=bot) pour inviter le bot à ton serveur !`)
        message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "invite",
    aliases: ["invite"],
    category: "General",
    description: "Envoie un lien pour inviter le bot sur son serveur !",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}