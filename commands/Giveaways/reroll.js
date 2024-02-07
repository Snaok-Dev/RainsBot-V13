module.exports.run = async (client, message, args, data) => {
    let messageID = args[0];
    if (!messageID || isNaN(parseInt(messageID)) || messageID.length !== 18) {
        return message.channel.send('⚠️ Veuillez spécifier l\'ID d\'un giveaway à relancer. \nPour récupérer l\'ID, faites clic droit sur le giveaway -> Copier l\'identifiant. Si cette option n\'apparaît pas, allez dans vos Paramètres utilisateurs -> Apparence -> Mode développeur.');
    }

    try {
        const newWinners = await client.giveawaysManager.reroll(messageID, {
            congrat: '🎉 Félicitations, les nouveaux gagnants sont: {winners}!',
            error: 'Aucun gagnant valide n\'a pu être choisi.'
        });
        message.channel.send(`Le giveaway avec l'ID ${messageID} a été relancé avec succès. Les nouveaux gagnants sont : ${newWinners.join(', ')}`);
    } catch (error) {
        message.channel.send(`Aucun giveaway trouvé avec l'ID ${messageID}.`);
    }
};

module.exports.help = {
    name: "reroll",
    aliases: ["reroll"],
    category: "Giveaways",
    description: "Changer de gagnant sur un giveaway",
    usage: "<ID du giveaway>",
    cooldown: 5,
    memberPerms: ["MANAGE_MESSAGES"],
    botPerms: [],
    args: true
};
