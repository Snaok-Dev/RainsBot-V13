const { Permissions } = require('discord.js');

module.exports.run = async (client, message, args, data) => {
    const emojis = require('../../emojis');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user || !message.guild.members.cache.has(user.id)) return message.channel.send('⚠️ Cet utilisateur n\'existe pas !');

    if (user.id === message.author.id) return message.channel.send(`⚠️ Vous ne pouvez pas vous bannir vous-même ${emojis.facepalm}`);

    const reason = args.slice(1).join(" ") || "Pas de raison spécifiée";

    const member = message.guild.members.cache.get(user.id);

    const memberPosition = member.roles.highest.position;
    const moderatorPosition = message.guild.members.cache.get(message.author.id).roles.highest.position;

    if (message.guild.ownerId !== message.author.id) {
        if (moderatorPosition <= memberPosition) return message.channel.send(`⚠️ Vous ne pouvez pas bannir ce membre.`);
    }

    if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        return message.channel.send(`⚠️ Je n'ai pas les permissions suffisantes pour bannir des membres.`);
    }

    try {
        await member.ban({ reason: reason });
        message.channel.send(`✅ ${user} a été banni par ${message.author} pour la raison suivante : **${reason}**`);
    } catch (err) {
        console.error(err);
        message.channel.send(`⚠️ Une erreur est survenue, veuillez réessayer. \n\`\`\`js\n${err}\n\`\`\``);
    }
}

module.exports.help = {
    name: "ban",
    aliases: ["ban"],
    category: "Moderation",
    description: "Bannir un membre",
    usage: "<membre> [raison]",
    cooldown: 5,
    memberPerms: ["BAN_MEMBERS"],
    botPerms: ["BAN_MEMBERS"],
    args: true
};
