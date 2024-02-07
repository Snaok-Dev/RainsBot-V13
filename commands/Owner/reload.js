module.exports.run = (client, message, args) => {
    if (message.author.id !== client.config.owner.id) {
        return client.emit('ownerOnly', message);
    }
    
    if (!args.length) {
        return message.channel.send('⚠️ Veuillez indiquer une commande à recharger !');
    }

    const commandName = args[0].toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

    if (!command || command.help.category === undefined) {
        return message.channel.send(`⚠️ Impossible de recharger la commande \`${commandName}\`. Vérifiez son orthographe et assurez-vous qu'elle appartient à une catégorie.`);
    }

    delete require.cache[require.resolve(`../${command.help.category}/${commandName}.js`)];

    try {
        const newCommand = require(`../${command.help.category}/${commandName}.js`);
        client.commands.set(newCommand.help.name, newCommand);
        message.channel.send(`✅ La commande \`${commandName}\` a bien été rechargée !`);
    } catch (error) {
        console.error(error);
        message.channel.send(`⚠️ Une erreur est survenue lors du rechargement de la commande \`${commandName}\`:\n\`\`\`js\n${error.message}\n\`\`\``);
    }
};

module.exports.help = {
    name: "reload",
    aliases: ["reload"],
    category: 'Owner',
    description: "Recharger une commande",
    usage: "<commande>",
    cooldown: 5,
    memberPerms: [],
    botPerms: [],
    args: true
};
