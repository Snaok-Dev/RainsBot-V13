const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports.run = async (client, message) => {
    if (message.author.id !== client.config.owner.id) return client.emit('ownerOnly', message);

    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description = `Serveurs: ${client.guilds.cache.size}\n\n`+
        client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres (${r.id})`)
            .slice(0, 10).join("\n");

    const embed = new MessageEmbed()
        .setColor(client.config.embed.color) .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setTitle(`PAGE: ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
        .setDescription(description)
        .setFooter({ text: client.config.embed.footer, iconURL:client.user.displayAvatarURL()})
        .setTimestamp();

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel('⬅')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('next')
                .setLabel('➡')
                .setStyle('PRIMARY'),
        );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const filter = interaction => interaction.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async interaction => {
        if (interaction.customId === 'previous') {
            i0 = Math.max(0, i0 - 10);
            i1 = i0 + 10;
            page--;
        } else if (interaction.customId === 'next') {
            i0 = Math.min(client.guilds.cache.size - 10, i0 + 10);
            i1 = Math.min(client.guilds.cache.size, i1 + 10);
            page++;
        }

        description = `Serveurs: ${client.guilds.cache.size}\n\n`+
            client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres (${r.id})`)
                .slice(i0, i1).join("\n");

        embed.setTitle(`PAGE: ${page}/${Math.ceil(client.guilds.cache.size / 10)}`)
            .setDescription(description);

        await interaction.update({ embeds: [embed] });
    });

    collector.on('end', () => {
        row.components.forEach(component => component.setDisabled(true));
        msg.edit({ components: [row] });
    });
};

module.exports.help = {
    name: "guildslist",
    aliases: ["guildslist", "glist"],
    category: 'Owner',
    description: "Afficher la liste des serveurs",
    usage: "",
    cooldown: 3,
    memberPerms: [],
    botPerms: ["EMBED_LINKS", "ADD_REACTIONS"],
    args: false
};
