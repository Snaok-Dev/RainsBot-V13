const { MessageEmbed } = require("discord.js");

module.exports = async (client, message) => {
    const data = await client.getGuild(message.guild);

    if (data.plugins.logs.enabled && data.plugins.logs.channel) {
        if (!message.guild.me.hasPermission("VIEW_AUDIT_LOG") || !message.guild.me.hasPermission("SEND_MESSAGES")) return;

        const fetchGuildAuditLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: "MESSAGE_DELETE"
        });

        const latestMessageDeleted = fetchGuildAuditLogs.entries.first();
        if (!latestMessageDeleted) return;

        const { executor } = latestMessageDeleted;

        // Vérifie si l'exécuteur est un utilisateur et non un bot
        if (executor && !executor.bot && executor.id !== message.author.id && !message.author.bot) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${executor.username} a supprimé un message de ${message.author}`)
                .addFields(
                    { name: "Message supprimé", value: message.content || "Impossible d'afficher le message", inline: true },
                    { name: "Salon", value: message.channel, inline: false },
                )
                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})

            message.guild.channels.cache.get(data.plugins.logs.channel).send({ embeds: [embed] });
        }
    }
};
