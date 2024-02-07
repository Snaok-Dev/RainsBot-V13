module.exports.run = async (client, message, args) => {
    let messageID = args[0];
    if (!messageID || isNaN(parseInt(messageID)) || messageID.length !== 18) {
        return message.channel.send('⚠️ Veuillez spécifier l\'ID d\'un giveaway à terminer. \nPour récupérer l\'ID, faites clic droit sur le giveaway -> Copier l\'identifiant. Si cette option n\'apparaît pas, allez dans vos Paramètres utilisateurs -> Apparence -> Mode développeur.');
    }

    try {
        await client.giveawaysManager.edit(messageID, {
            setEndTimestamp: Date.now()
        });
        message.channel.send(`Le giveaway avec l'ID ${messageID} a été terminé.`);
    } catch (err) {
        if (err.endsWith('is already ended.')) {
            message.channel.send(`Le giveaway avec l'ID ${messageID} est déjà terminé.`);
        } else if (err.startsWith('No giveaway found with ID')) {
            message.channel.send(`Aucun giveaway trouvé avec l'ID ${messageID}.`);
        } else {
            console.error(err);
            message.channel.send('Une erreur est survenue lors de la tentative de terminaison du giveaway.');
        }
    }
};

module.exports.help = {
    name: "end",
    aliases: ["end"],
    category: "Giveaways",
    description: "Terminer un giveaway",
    usage: "<ID du giveaway>",
    cooldown: 5,
    memberPerms: ["MANAGE_MESSAGES"],
    botPerms: [],
    args: true
};
