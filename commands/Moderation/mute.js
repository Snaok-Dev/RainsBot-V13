const { MessageEmbed } = require('discord.js');
const emojis = require('../../emojis');

module.exports.run = async (client, message, args, data) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0]?.toLowerCase()));

    if (!user || !message.guild.members.cache.has(user.id)) return message.channel.send('⚠️ Cet utilisateur n\'existe pas !');

    if (user.id === message.author.id) return message.channel.send(`⚠️ Vous ne pouvez pas vous mute vous-même ${emojis.facepalm}`);

    const reason = args.slice(1).join(" ") || "Pas de raison spécifiée";

    const member = message.guild.members.cache.get(user.id);

    if (member.permissions.has('ADMINISTRATOR')) return message.channel.send('⚠️ Vous ne pouvez pas mute un administrateur !');

    const memberPosition = member.roles.highest.position;
    const moderatorPosition = message.guild.members.cache.get(message.author.id).roles.highest.position;

    if (message.guild.ownerId !== message.author.id) {
        if (moderatorPosition <= memberPosition) return message.channel.send(`⚠️ Vous ne pouvez pas mute une personne plus haute que vous.`);
    }

    let muteRole = data.muterole;

    if (!message.guild.roles.cache.has(muteRole)) {
        try {
            const role = await message.guild.roles.create({
                name: "Muted",
                color: "#000000",
                permissions: [],
                position: message.guild.me.roles.highest.position - 1,
                mentionable: false
            });

            await client.updateGuild(message.guild, { muterole: role.id });

            message.guild.channels.cache.forEach(channel => {
                if (!message.guild.me.permissionsIn(channel).has("MANAGE_CHANNELS")) return;
                channel.permissionOverwrites.edit(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false,
                });
            });

            await member.roles.add(role);
            message.channel.send(`✅ ${user} s'est fait mute par ${message.author} pour la raison suivante: **${reason}**`);
        } catch (err) {
            console.error(err);
            message.channel.send(`Une erreur est survenue, veuillez réessayer. \n\`\`\`js\n${err}\n\`\`\``);
        }
    } else {
        try {
            message.guild.channels.cache.forEach(channel => {
                if (!message.guild.me.permissionsIn(channel).has("MANAGE_CHANNELS")) return;
                if (!channel.permissionOverwrites.has(muteRole)) {
                    channel.permissionOverwrites.edit(message.guild.roles.cache.get(muteRole), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false,
                    });
                }
            });

            await member.roles.add(muteRole);
            message.channel.send(`✅ ${user} s'est fait mute par ${message.author} pour la raison suivante: **${reason}**`);
        } catch (err) {
            console.error(err);
            message.channel.send(`Une erreur est survenue, veuillez réessayer. \n\`\`\`js\n${err}\n\`\`\``);
        }
    }

    if (data.plugins.logs.enabled && message.guild.channels.cache.has(data.plugins.logs.channel)) {
        const embed = new MessageEmbed()
            .setColor(client.config.embed.color)
            .setDescription(`L'utilisateur **${user.username}** s'est fait mute par ${message.author}. \nRaison: **${reason}**`)
            .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
        message.guild.channels.cache.get(data.plugins.logs.channel).send(embed);
    }
}

module.exports.help = {
    name: "mute",
    aliases: ["mute"],
    category: "Moderation",
    description: "Rendre muet un membre",
    usage: "<membre> [raison]",
    cooldown: 5,
    memberPerms: ["MANAGE_ROLES"],
    botPerms: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    args: true
}
