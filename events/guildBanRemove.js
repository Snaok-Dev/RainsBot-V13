const { MessageEmbed } = require("discord.js");

module.exports = async (client, guild, user) => {
    const data = await client.getGuild(guild);

    if (data.plugins.logs.enabled && data.plugins.logs.channel) {
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

        try {
            const fetchGuildAuditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_REMOVE'
            });

            const auditLogEntry = fetchGuildAuditLogs.entries.first();
            if (!auditLogEntry) return;

            const executor = auditLogEntry.executor;

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`L'utilisateur **${user.username}** s'est fait débannir par ${executor}`)
                .setFooter({ text: 'ID: ' + user.id()})
                .setTimestamp();

            const logsChannel = guild.channels.cache.get(data.plugins.logs.channel);
            if (logsChannel && logsChannel.type === 'GUILD_TEXT') {
                logsChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des logs de levée de bannissement de membre :', error);
        }
    }
};
