const { MessageEmbed } = require('discord.js');
const emojis = require('../../emojis');

module.exports.run = async (client, message, args, data) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user) return message.channel.send('⚠️ Veuillez mentionner un membre à couper le son dans un vocal.');
    if (user === message.author) return message.channel.send(`⚠️ Vous ne pouvez pas vous couper le son à vous même ${emojis.facepalm}`);
    
    user = message.guild.members.cache.get(user.id);

    if (!user.voice.channel) return message.channel.send('⚠️ Cet utilisateur n\'est pas connecté dans un salon vocal.');
    if (user.voice.deaf) return message.channel.send('⚠️ Cet utilisateur a déjà le son coupé.');

    try {
        await user.voice.setDeaf(true);
        message.channel.send(`✅ **${message.author.username}** a coupé le son à ${user} dans **${user.voice.channel.name}**`);

        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
            const embed = new MessageEmbed()
                .setColor(client.config.embed.color)
                .setDescription(`${message.author} a coupé le son à **${user.user.username}** dans **${user.voice.channel.name}**`)
                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
            message.guild.channels.cache.get(data.plugins.logs.channel).send({ embeds: [embed] });
        }
    } catch (err) {
        console.error(err);
        message.channel.send('⚠️ Une erreur est survenue lors de la tentative de coupe du son, veuillez réessayer.');
    }
}

module.exports.help = {
    name: "deafen",
    aliases: ["deafen", "deaf", "deaf-member", "deafen-member"],
    category: "Moderation",
    description: "Couper le son d'un membre dans un salon vocal",
    usage: "<membre>",
    cooldown: 5,
    memberPerms: ["DEAFEN_MEMBERS"],
    botPerms: ["DEAFEN_MEMBERS", "EMBED_LINKS"],
    args: true
}
