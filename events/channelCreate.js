const { MessageEmbed } = require("discord.js");

module.exports = async (client, channel) => {
    if (channel.type === "dm") return;

    const data = await client.getGuild(channel.guild);

    if (data.plugins.logs.enabled && data.plugins.logs.channel) {
        if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

        let cType = channel.type;
        switch (cType) {
            case "GUILD_TEXT": cType = "Textuel"; break;
            case "GUILD_VOICE": cType = "Vocal"; break;
            case "GUILD_CATEGORY": cType = "Catégorie"; break;
            case "GUILD_NEWS": cType = "Annonce"; break;
            case "GUILD_STORE": cType = "Magasin"; break;
            default: cType = "Inconnu";
        }

        try {
            const fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_CREATE'
            });

            const latestChannelCreated = fetchGuildAuditLogs.entries.first();
            if (!latestChannelCreated) return;

            const { executor } = latestChannelCreated;

            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor({ name: `${executor.username} a créé un nouveau salon`, iconURL: executor.displayAvatarURL({ dynamic: true })})
            .addFields(
                { name: "Nom", value: channel.name, inline: true },
                { name: "Type", value: cType, inline: false },
                { name: "ID", value: channel, inline: false },
            )
            .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})

            const logsChannel = await channel.guild.channels.fetch(data.plugins.logs.channel);
            if (logsChannel && logsChannel.type === 'GUILD_TEXT') {
                logsChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des logs de création de salon :', error);
        }
    }
};
