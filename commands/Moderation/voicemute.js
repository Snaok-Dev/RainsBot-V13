const { MessageEmbed } = require('discord.js');
const emojis = require('../../emojis');

module.exports.run = async (client, message, args, data) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user) return message.channel.send('⚠️ Veuillez mentionner un membre à mute dans un vocal.');
    if (user.id === message.author.id) return message.channel.send(`⚠️ Vous ne pouvez pas vous mute vous-même ${emojis.facepalm}`);
    
    const member = message.guild.members.cache.get(user.id);

    if (!member.voice.channel) return message.channel.send('⚠️ Cet utilisateur n\'est pas connecté dans un vocal.');

    if (member.voice.serverMute) return message.channel.send('⚠️ Cet utilisateur est déjà mute.');

    try {
        await member.voice.setMute(true);
        message.channel.send(`✅ ${user} a été mute du salon vocal **${member.voice.channel}**`);

        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
            const embed = new MessageEmbed()
                .setColor('ORANGE')
                .setDescription(`L'utilisateur **${user.username}** a été mute du salon vocal **${member.voice.channel}** par ${message.author}`)
                .setFooter(client.config.embed.footer, client.user.displayAvatarURL());
            message.guild.channels.cache.get(data.plugins.logs.channel).send({ embeds: [embed] });
        }
    } catch (err) {
        console.error(err);
        message.channel.send(`⚠️ Une erreur est survenue lors du mute de l'utilisateur dans le salon vocal.`);
    }
};

module.exports.help = {
    name: "voicemute",
    aliases: ["voicemute", "vocmute", "vcmute", "voice-mute"],
    category: "Moderation",
    description: "Rendre muet un membre dans un salon vocal",
    usage: "<membre>",
    cooldown: 5,
    memberPerms: ["MUTE_MEMBERS"],
    botPerms: ["MUTE_MEMBERS", "EMBED_LINKS"],
    args: true
};
