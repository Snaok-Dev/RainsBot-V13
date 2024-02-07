const { MessageCollector } = require('discord.js');

module.exports.run = (client, message, args, data) => {
    if (!data.plugins.suggestion.enabled) return message.channel.send(`⚠️ Le plugin de suggestion n'est pas activé. Faites \`${data.prefix}enable suggestion\` pour l'activer!`);

    if (args.length) {
        const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if (!newChannel) return message.channel.send('⚠️ Ce salon n\'existe pas.');

        if (newChannel.type !== "GUILD_TEXT") return message.channel.send('⚠️ Le salon de suggestion doit être un salon textuel.');

        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send('⚠️ Vous devez avoir la permission Gérer les salons pour effectuer cette action.');

        if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send('⚠️ Je n\'ai pas les permissions nécessaires pour envoyer des liens intégrés dans ce salon.');

        if (newChannel.id === data.plugins.suggestion.channel) return message.channel.send('⚠️ Ce salon est déjà défini comme salon de suggestion.');

        data.plugins.suggestion = {
            enabled: true,
            channel: newChannel.id
        };

        data.markModified("plugins.suggestion");
        data.save();

        message.channel.send(`✅ Les suggestions ont bien été activées sur le serveur. Toutes les suggestions faites via la commande \`${data.prefix}suggestion\` seront envoyées dans le salon <#${newChannel.id}>!`);
    } else {
        message.channel.send("Quel salon souhaitez-vous définir comme salon de suggestion ?");

        const filter = m => m.author.id === message.author.id;

        const collector = new MessageCollector(message.channel, { filter, time: 30000, max: 1 });

        collector.on("collect", async msg => {
            if (msg.content.toLowerCase() === "annuler") {
                collector.stop(true);
                return message.channel.send('Commande annulée');
            } else {
                const newChannel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content);

                if (!newChannel) return message.channel.send('⚠️ Ce salon n\'existe pas.');

                if (newChannel.type !== "GUILD_TEXT") return message.channel.send('⚠️ Le salon de suggestion doit être un salon textuel.');

                if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send('⚠️ Vous devez avoir la permission Gérer les salons pour effectuer cette action.');

                if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send('⚠️ Je n\'ai pas les permissions nécessaires pour envoyer des liens intégrés dans ce salon.');

                if (newChannel.id === data.plugins.suggestion.channel) return message.channel.send('⚠️ Ce salon est déjà défini comme salon de suggestion.');

                data.plugins.suggestion = {
                    enabled: true,
                    channel: newChannel.id
                };

                data.markModified("plugins.suggestion");
                data.save();

                message.channel.send(`✅ Les suggestions ont bien été activées sur le serveur. Toutes les suggestions faites via la commande \`${data.prefix}suggestion\` seront envoyées dans le salon <#${newChannel.id}>!`);
            }
        });

        collector.on("end", (_, reason) => {
            if (reason === "time") return message.channel.send('Temps écoulé');
        });
    }
};

module.exports.help = {
    name: "suggestion-channel",
    aliases: ["suggestion-channel", "suggestionchannel", "suggestions-channel", "suggestionschannel"],
    category: 'Config',
    description: "Configurer le salon de suggestions du serveur",
    usage: "<salon>",
    cooldown: 5,
    memberPerms: ["MANAGE_CHANNELS"],
    botPerms: ["EMBED_LINKS"],
    args: false
};
