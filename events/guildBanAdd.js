const { MessageEmbed } = require("discord.js");

module.exports = async (client, guild, user) => {
    const data = await client.getGuild(guild);

    if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

    try {
        const fetchGuildAuditLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD'
        });

        const auditLogEntry = fetchGuildAuditLogs.entries.first();
        if (!auditLogEntry) return;

        const { executor } = auditLogEntry;

        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
            let description = `L'utilisateur **${user.username}** s'est fait bannir par ${executor}`;
            if (auditLogEntry.reason) description += `\nRaison: **${auditLogEntry.reason}**`;

            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(description)
                .setFooter({ text: 'ID: ' + user.id()})
                .setTimestamp();

            const logsChannel = await guild.channels.fetch(data.plugins.logs.channel);
            if (logsChannel && logsChannel.type === 'GUILD_TEXT') {
                logsChannel.send({ embeds: [embed] });
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des logs de bannissement de membre :', error);
    }
};
