module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.config.owner.id) {
        return client.emit('ownerOnly', message);
    }

    try {
        await message.channel.send('🔄 **Redémarrage du bot...**');
        await client.destroy();
        process.exit();
    } catch (error) {
        console.error('Erreur lors du redémarrage du bot :', error);
        process.exit(1); // Quitter le processus avec un code d'erreur
    }
};
   
module.exports.help = {
    name: "restart",
    aliases: ["restart"],
    category: 'Owner',
    description: "Redémarrer le bot",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: [],
    args: false,
};
