const emojis = require('../../emojis');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, data) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user || !message.guild.members.cache.has(user.id)) return message.channel.send('⚠️ Cet utilisateur n\'existe pas !');

    if (user.id === message.author.id) return message.channel.send(`⚠️ Vous ne pouvez pas vous expulser vous-même ${emojis.facepalm}`);

    const reason = args.slice(1).join(" ") || "Pas de raison spécifiée";

    const member = message.guild.members.cache.get(user.id);

    const memberPosition = member.roles.highest.position;
    const moderatorPosition = message.guild.members.cache.get(message.author.id).roles.highest.position;

    if (message.guild.ownerId !== message.author.id) {
        if (moderatorPosition <= memberPosition) return message.channel.send(`⚠️ Vous ne pouvez pas expulser ce membre.`);
    }

    if (!member.kickable) return message.channel.send(`⚠️ Je n'ai pas les permissions suffisantes pour expulser ce membre, veuillez vérifier que mon rôle est au-dessus du membre à expulser, et réessayez.`);

    try {
        await member.kick(reason);
        message.channel.send(`✅ ${user} a été expulsé par ${message.author} pour la raison suivante : **${reason}**`);

        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
            const embed = new MessageEmbed()
                .setColor(client.config.embed.color)
                .setDescription(`L'utilisateur **${user.username}** a été expulsé par ${message.author}. \nRaison : **${reason}**`)
                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
            message.guild.channels.cache.get(data.plugins.logs.channel).send({ embeds: [embed] });
        }
    } catch (err) {
        console.error(err);
        message.channel.send('⚠️ Une erreur est survenue lors de l\'expulsion de l\'utilisateur, veuillez réessayer.');
    }
}

module.exports.help = {
    name: "kick",
    aliases: ["kick", "expel"],
    category: "Moderation",
    description: "Expulser un membre",
    usage: "<membre> [raison]",
    cooldown: 5,
    memberPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    args: true
}
