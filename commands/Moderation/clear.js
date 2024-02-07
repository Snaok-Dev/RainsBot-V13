const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, data) => {
    let toDelete = args[0];
    if (!toDelete || isNaN(toDelete) || parseInt(toDelete) < 1 || parseInt(toDelete) > 100) {
        return message.channel.send(`⚠️ Veuillez indiquer un nombre entre 1 et 100.`);
    }

    await message.delete();

    try {
        let messages = await message.channel.messages.fetch({
            limit: Math.min(toDelete, 100),
            before: message.id
        });

        if (messages.size === 1) {
            await messages.first().delete().catch(() => {});
        } else {
            await message.channel.bulkDelete(messages, true);

            message.channel.send(`✅ ${toDelete} messages supprimés.`);

            if (data.plugins.logs.enabled && message.guild.channels.cache.has(data.plugins.logs.channel)) {
                const embed = new MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setDescription(`${message.author} a supprimé ${toDelete} messages dans ${message.channel}`)
                    .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
                message.guild.channels.cache.get(data.plugins.logs.channel).send(embed);
            }
        }
    } catch (err) {
        if (err.code === 50034) {
            return message.channel.send(`⚠️ Impossible de supprimer des messages vieux de plus de 2 semaines.`);
        } else {
            console.error(err);
            return message.channel.send(`⚠️ Une erreur est survenue, veuillez réessayer. \n\`\`\`js\n${err}\n\`\`\``);
        }
    }
}

module.exports.help = {
    name: "clear",
    aliases: ["clear", "purge"],
    category: "Moderation",
    description: "Supprimer une certaine quantité de messages entre 1 et 100",
    usage: "<nombre de messages>",
    cooldown: 10,
    memberPerms: ["MANAGE_MESSAGES"],
    botPerms: ["MANAGE_MESSAGES"],
    args: true
};
