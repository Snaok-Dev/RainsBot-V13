module.exports.run = (client, message, args) => {
    if (message.author.id !== client.config.owner.id) {
        return client.emit('ownerOnly', message);
    }

    const guildID = args[0];
    if (!guildID || isNaN(guildID) || guildID.length !== 18) {
        return message.channel.send(`⚠️ Veuillez indiquer l'ID d'un serveur à quitter.`);
    }

    const guild = client.guilds.cache.get(guildID);
    if (!guild) {
        return message.channel.send('⚠️ Ce serveur est introuvable.');
    }

    if (!guild.available) {
        return message.channel.send('⚠️ Ce serveur n\'est pas disponible pour le moment. Veuillez réessayer plus tard.');
    }

    guild.leave()
        .then(removedGuild => {
            console.log(`Le bot a quitté le serveur ${removedGuild.name} avec succès.`);
            message.channel.send(`✅ Le bot a quitté le serveur ${removedGuild.name}.`).catch(() => {});
        })
        .catch(error => {
            console.error(`Une erreur est survenue lors du processus de départ du serveur : ${error}`);
            message.channel.send(`⚠️ Une erreur est survenue lors du processus de départ du serveur : \`\`\`js\n${error}\n\`\`\``);
        });
};

module.exports.help = {
    name: "leave",
    aliases: ["leave"],
    category: 'Owner',
    description: "Quitter un serveur",
    usage: "<ID_du_serveur>",
    cooldown: 3,
    memberPerms: [],
    botPerms: [],
    args: true
};
