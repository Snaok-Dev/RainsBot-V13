const { MessageEmbed } = require("discord.js");

module.exports = async (client, emoji) => {
    const data = await client.getGuild(emoji.guild);

    if (data.plugins.logs.enabled && data.plugins.logs.channel) {
        if (!emoji.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

        try {
            const fetchGuildAuditLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: 'EMOJI_CREATE'
            });

            const auditLogEntry = fetchGuildAuditLogs.entries.first();
            if (!auditLogEntry) return;

            const { executor } = auditLogEntry;

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor({ name: `${fetchGuildAuditLogs.entries.first().executor.username} a créé un nouvel emoji !`, value: emoji.url})
                .addFields(
                    { name: "Nom", value: emoji.name, inline: true },
                    { name: "Type", value: emoji.animated, inline: false },
                    { name: "Lien", value: emoji.url, inline: false },
                )
                .setFooter({ text: 'ID:' + emoji.id, iconURL:client.user.displayAvatarURL()})
                .setTimestamp();

            const logsChannel = await emoji.guild.channels.fetch(data.plugins.logs.channel);
            if (logsChannel && logsChannel.type === 'GUILD_TEXT') {
                logsChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des logs de création d\'emoji :', error);
        }
    }
};
