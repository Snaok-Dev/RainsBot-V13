const beautify = require("beautify");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, data, userData) => {
    if (message.author.id !== client.config.owner.id) return client.emit('ownerOnly', message);
    
    const content = args.join(" ");
    if (!content) return message.channel.send('⚠️ Indiquez du code à évaluer!');

    try {
        let result = eval(content);

        if (typeof result !== "string") {
            result = require("util").inspect(result, { depth: 0 });
        }

        if (result.includes(client.token)) {
            result = result.replace(client.token, "T0K3N");
        }

        const embed = new MessageEmbed()
            .setTitle(`✅ Succès ! \nRéponse :`)
            .setDescription(`\`\`\`js\n${result}\n\`\`\``)
            .addField("Évaluation :", `\`\`\`js\n${beautify(content, { format: "js" })}\n\`\`\``)
            .addField("Type :", typeof result);

        if (embed.description.length > 1000) {
            embed.description = `\`\`\`js\n${result.slice(0, 999)}... \net plus...\n\`\`\``;
        }

        message.channel.send(embed);
    } catch (error) {
        let err = error.toString();

        if (err.includes(client.token)) {
            err = err.replace(client.token, "T0K3N");
        }

        const embed = new MessageEmbed()
            .setTitle(`⚠️ ERREUR :`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
            .addField("Évaluation", `\`\`\`js\n${beautify(content, { format: "js" })}\n\`\`\``);

        if (embed.description.length > 1000) {
            embed.description = `\`\`\`js\n${err.slice(0, 999)}... \net plus...\n\`\`\``;
        }

        message.channel.send(embed);
    }
}

module.exports.help = {
    name: "eval",
    aliases: ["eval", "e"],
    category: 'Owner',
    description: "Renvoie un code JavaScript testé",
    usage: "<code>",
    cooldown: 3,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: true
}
