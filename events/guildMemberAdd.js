module.exports = async (client, member) => {
    const data = await client.getGuild(member.guild);

    if (data.plugins.protection.raidmode === true) {
        try {
            await member.send("**⚠️ Le Raidmode est activé sur le serveur " + member.guild.name + ", vous avez donc été kick de celui-ci! ⚠️** \nSi vous pensez que c'est une erreur, contactez le propriétaire du serveur.");
            await member.kick("Raidmode activé");
        } catch (error) {
            console.error("Erreur lors de l'envoi du message ou du kick du membre :", error);
        }

        if (data.plugins.logs.channel) {
            const logsChannel = member.guild.channels.cache.get(data.plugins.logs.channel);
            if (logsChannel && logsChannel.type === 'GUILD_TEXT') {
                logsChannel.send(`**${member.user.tag}** a tenté de rejoindre le serveur, mais le Raidmode est activé. ${client.user.username} l'a donc expulsé du serveur.`);
            }
        }
    }

    if (data.plugins.autorole.enabled && data.plugins.autorole.role) {
        try {
            await member.roles.add(data.plugins.autorole.role);
        } catch (error) {
            console.error("Erreur lors de l'ajout du rôle automatique au membre :", error);
        }
    }

    if (!data.plugins.welcome.enabled) return;

    let welcomeMsg = data.plugins.welcome.message
        .replace(/{user}/g, member)
        .replace(/{guildName}/g, member.guild.name)
        .replace(/{memberCount}/g, member.guild.memberCount)
        .replace(/{username}/g, member.user.username)
        .replace(/{usertag}/g, member.user.tag);

    try {
        if (!data.plugins.welcome.channel) {
            await member.send(welcomeMsg);
        } else {
            const welcomeChannel = member.guild.channels.cache.get(data.plugins.welcome.channel);
            if (welcomeChannel && welcomeChannel.type === 'GUILD_TEXT') {
                welcomeChannel.send(welcomeMsg);
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message de bienvenue :", error);
    }
};
