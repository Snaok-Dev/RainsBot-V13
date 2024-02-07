const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
    
    const data = await client.getGuild(newMember.guild);
    if (!data || !data.plugins.protection.antigiverole) return;

    if (oldMember.roles.cache.size < newMember.roles.cache.size && newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
        const fetchGuildAuditLogs = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE'
        });

        const { executor } = fetchGuildAuditLogs.entries.first();

        if (!executor || executor.id === newMember.guild.ownerID || executor.id === newMember.id || newMember.id === newMember.guild.ownerID) return;

        const oldAdminRoles = oldMember.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR') || role.permissions.has('BAN_MEMBERS') || role.permissions.has('KICK_MEMBERS'));
        const newAdminRoles = newMember.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR') || role.permissions.has('BAN_MEMBERS') || role.permissions.has('KICK_MEMBERS'));

        if (newAdminRoles.size > oldAdminRoles.size) {
            newAdminRoles.forEach(async (r) => {
                if (!oldAdminRoles.has(r.id)) {
                    if (r.position >= newMember.guild.me.roles.highest.position) {
                        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
                            const embed = new MessageEmbed()
                                .setColor('RED')
                                .setDescription('L\'antigiverole est activé et un utilisateur a reçu un rôle de modérateur/administrateur, mais je n\'ai pas pu lui retirer car le rôle est placé au-dessus de moi!')
                                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
                            return newMember.guild.channels.cache.get(data.plugins.logs.channel).send(embed);
                        }
                    } else {
                        await newMember.roles.remove(r.id);

                        if (data.plugins.logs.enabled && data.plugins.logs.channel) {
                            const embed = new MessageEmbed()
                                .setColor('RED')
                                .setAuthor({ name:`${executor.username} a tenté de donner un rôle de modération à un utilisateur.`})
                                .addFields(
                                    { name: "Utilisateur", value: newMember.user.tag, inline: true },
                                    { name: "Rôle", value: r.name, value: false },
                                )
                                .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
                            newMember.guild.channels.cache.get(data.plugins.logs.channel).send(embed);
                        }
                    }
                }
            });
        }
    }
};
