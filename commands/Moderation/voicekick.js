const { MessageEmbed } = require("discord.js");
const emojis = require('../../emojis');

module.exports.run = async (client, message, args, data) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user) return message.channel.send('⚠️ Veuillez mentionner un membre à expulser d\'un salon vocal.');
    if (user.id === message.author.id) return message.channel.send(`⚠️ Vous ne pouvez pas vous expulser vous-même ${emojis.facepalm}`);

    const member = message.guild.members.cache.get(user.id);

    if (!member.voice.channel) return message.channel.send('⚠️ Cet utilisateur n\'est pas connecté dans un salon vocal.');

    try {
        await member.voice.kick();
        message.channel.send(`✅ ${user} a été expulsé du salon vocal **${member.voice.channel}**`);

        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
            const embed = new MessageEmbed()
                .setColor(client.config.embed.color)
                .setDescription(`L'utilisateur **${user.username}** a été expulsé du salon vocal **${member.voice.channel}** par ${message.author}`)
                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
            message.guild.channels.cache.get(data.plugins.logs.channel).send({ embeds: [embed] });
        }
    } catch (err) {
        console.error(err);
        message.channel.send(`⚠️ Une erreur est survenue lors de l'expulsion de l'utilisateur du salon vocal.`);
    }
};

module.exports.help = {
    name: "voicekick",
    aliases: ["voicekick", "vockick", "vckick", "voice-kick"],
    category: "Moderation",
    description: "Expulser un membre d'un salon vocal",
    usage: "<membre>",
    cooldown: 10,
    memberPerms: ["MOVE_MEMBERS"],
    botPerms: ["MOVE_MEMBERS", "EMBED_LINKS"],
    args: true
};
