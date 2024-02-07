module.exports = async (client, member) => {
    const data = await client.getGuild(member.guild);

    if (!data.plugins.goodbye.enabled) return;

    let goodbyeMsg = data.plugins.goodbye.message
        .replace(/{user}/g, member)
        .replace(/{guildName}/g, member.guild.name)
        .replace(/{memberCount}/g, member.guild.memberCount)
        .replace(/{username}/g, member.user.username)
        .replace(/{usertag}/g, member.user.tag);

    try {
        if (!data.plugins.goodbye.channel) {
            await member.send(goodbyeMsg);
        } else {
            const goodbyeChannel = member.guild.channels.cache.get(data.plugins.goodbye.channel);
            if (goodbyeChannel && goodbyeChannel.type === 'GUILD_TEXT') {
                await goodbyeChannel.send(goodbyeMsg);
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message de départ :", error);
    }
};
