module.exports.run = async (client, message, args, data) => {
    const userId = args[0];
    if (!userId || isNaN(userId)) return message.channel.send(`⚠️ Veuillez renseigner l'ID d'un membre.`);

    const reason = args.slice(1).join(" ") || "Pas de raison spécifiée";

    try {
        const toUnban = await client.users.fetch(userId);
        if (!toUnban) return message.channel.send(`⚠️ Cet utilisateur n'existe pas.`);

        const bansList = await message.guild.bans.fetch();
        const isBanned = bansList.get(toUnban.id);

        if (!isBanned) return message.channel.send(`⚠️ Cet utilisateur n'est pas banni.`);

        await message.guild.members.unban(toUnban, reason);
        message.channel.send(`✅ ${toUnban.tag} a été débanni pour la raison suivante: **${reason}**`);
    } catch (error) {
        console.error(error);
        message.channel.send(`⚠️ Une erreur est survenue lors du débannissement de l'utilisateur.`);
    }
};

module.exports.help = {
    name: "unban",
    aliases: ["unban"],
    category: "Moderation",
    description: "Débannir un membre",
    usage: "<ID du membre> [raison]",
    cooldown: 5,
    memberPerms: ["BAN_MEMBERS"],
    botPerms: ["BAN_MEMBERS"],
    args: true
};
