const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message) => {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Ping')
        .setDescription('Pinging...');

    message.channel.send({ embeds: [embed] }).then(async (msg) => {
        const pingEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Ping')
            .setDescription(`Mon ping est de ${Date.now() - message.createdTimestamp}ms`);

        await msg.edit({ embeds: [pingEmbed] });
    });
};

module.exports.help = {
    name: "ping",
    aliases: ["ping"],
    category: "General",
    description: "Vérifier la latence du bot",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: [],
    args: false
};
