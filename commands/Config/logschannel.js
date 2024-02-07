const { MessageCollector } = require('discord.js');

module.exports.run = async (client, message, args, data) => {
    if (!data.plugins.logs.enabled) return message.channel.send(`⚠️ Le plugin de logs n'est pas activé. Faites \`${data.prefix}enable logs\` pour l'activer !`);

    if (!data.plugins.logs.channel) {
        let MSG = await message.channel.send('ℹ️ Le salon de logs n\'est pas défini, voulez-vous le définir maintenant ? \nRépondez par oui ou par non.');
        const filter = m => m.author.id === message.author.id;

        const c1 = new MessageCollector(message.channel, filter, {
            time: 30000
        });

        c1.on("collect", async msg1 => {
            if (msg1.content.toLowerCase() === "oui") {
                c1.stop(true);

                let MSG1 = await message.channel.send('Très bien, et quel salon souhaitez-vous définir comme salon de logs ?');

                const c2 = new MessageCollector(message.channel, filter, {
                    time: 60000,
                    max: 5,
                });

                c2.on("collect", async msg2 => {
                    const channel = msg2.mentions.channels.first() || msg2.guild.channels.cache.get(msg2.content);
                    if (!channel) return message.channel.send('⚠️ Ce salon n\'existe pas, vérifiez que j\'ai accès au salon.');

                    if (channel.type !== "GUILD_TEXT") return message.channel.send('⚠️ Merci de donner un salon textuel. Je ne peux envoyer les messages de logs que dans un salon textuel (exclu salon d\'annonce)');

                    if (!channel.permissionsFor(client.user).has('SEND_MESSAGES') || !channel.permissionsFor(client.user).has('EMBED_LINKS')) return message.channel.send('⚠️ Je n\'ai pas les permissions de parler dans ce salon, donnez-moi les permissions Envoyer des messages et Intégrer des liens dans le salon.');

                    c2.stop(true);

                    MSG.delete().catch(() => {});
                    MSG1.delete().catch(() => {});
                    msg1.delete().catch(() => {});
                    msg2.delete().catch(() => {});

                    data.plugins.logs = {
                        enabled: true,
                        channel: channel.id
                    };

                    data.markModified("plugins.logs");
                    data.save();

                    message.channel.send(`✅ Salon de logs configuré. Les logs seront désormais envoyés dans <#${channel.id}>. \nFaites \`${data.prefix}config\` pour voir la configuration actuelle du bot sur le serveur !`);
                });

                c2.on("end", (collected, reason) => {
                    if (collected.size >= 5) return message.channel.send('⚠️ Vous avez dépassé les 5 essais. Veuillez refaire la commande et réessayez');
                    if (reason === "time") return message.channel.send('Temps écoulé');
                });
            } else {
                c1.stop(true);

                MSG.delete().catch(() => {});
                message.channel.send('Commande annulée');
            }
        });

        c1.on("end", (_, reason) => {
            if (reason === "time") {
                return message.channel.send('Temps écoulé');
            }
        });
    } else {
        const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        const oldChannel = data.plugins.logs.channel;

        if (!newChannel) return message.channel.send('⚠️ Veuillez spécifier un nouveau salon de logs !');

        if (newChannel.id === oldChannel) return message.channel.send('⚠️ Ce salon est le même que celui actuellement défini.');

        data.plugins.logs = {
            enabled: true,
            channel: newChannel.id
        };

        data.markModified("plugins.logs");
        data.save();

        message.channel.send(`✅ Le salon de logs a été modifié avec succès`);
    }
};

module.exports.help = {
    name: "logschannel",
    aliases: ["logschannel", "logs-channel", "logchannel", "log-channel"],
    category: 'Config',
    description: "Modifier le salon de logs",
    usage: "<salon>",
    cooldown: 5,
    memberPerms: ["MANAGE_GUILD"],
    botPerms: [],
    args: false
};
