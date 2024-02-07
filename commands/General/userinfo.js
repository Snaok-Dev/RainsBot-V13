const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const emojis = require('../../emojis');

module.exports.run = async (client, message, args) => {
	let user;

	if (!args.length) {
		user = message.author;
	} else {
		user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase().includes(args[0].toLowerCase()));
	};

	if (!user || !message.guild.members.cache.get(user.id)) return message.channel.send('⚠️ Cet utilisateur n\'existe pas !');

    const member = message.guild.members.cache.get(user.id);

    // return console.log(member)

    let clientStatus = member.presence.clientStatus;
    clientStatus = clientStatus ? Object.keys(clientStatus).join(', ') : 'Inconnu';

    const userStatus = member.presence.status;
    let statusEmoji = '';
    switch (userStatus) {
      	case "online":
            statusEmoji = '🟢';
        	break;
      	case "offline":
            statusEmoji = '⚫';
        	break;
      	case "idle":
            statusEmoji = '🌙';
        	break;
      	case "dnd":
            statusEmoji = '⛔';
        	break;
    };

    const userInfoEmbed = new MessageEmbed()
        .setColor(client.config.embed.color)
        .setAuthor({
            name: member.user.tag.toString(),
            iconURL: member.user.displayAvatarURL({ dynamic: true })
        })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: "\\👨 Nom d'utilisateur", value: member.user.username, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "\\🤖 Bot ?", value: member.user.bot ? "Oui" : "Non", inline: true },
            { name: "\\🖥️ Client", value: clientStatus, inline: true },
            { name: "\\⌨️ Activité", value: member.presence.activities.length > 0 ? member.presence.activities[0].name : "Aucune", inline: true },
            { name: "Status", value: `${statusEmoji} ${userStatus}`, inline: true },
            { name: "\\🆕 Compte créé", value: moment(member.createdAt).locale('fr').format('llll'), inline: true },
            { name: "\\📥 Rejoint le", value: moment(member.joinedAt).locale('fr').format('llll'), inline: true },
        )  
        .setFooter({ text: `ID: ${member.id}`})

    if (member.roles.cache.size > 1) {
        const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role.id !== message.guild.roles.everyone.id).map(role => role.toString());
        const reste = roles.splice(0, 29).join(", ");
        userInfoEmbed.addField("🎭 Rôles", member.roles.cache.size > 30 ? `${reste} et plus...` : reste);
    }

    message.channel.send({ embeds: [userInfoEmbed] });
}

module.exports.help = {
    name: "userinfo",
    aliases: ["userinfo", "ui", "userinfos", "infouser", "infosuser", "user-info", "user-infos", "info-user", "infos-user"],
    category: "General",
    description: "Afficher des informations sur un membre ou vous-même",
    usage: "[membre]",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}
