const { Collection } = require('discord.js');

module.exports = async (interaction, client) => {

        if (interaction.isCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return console.error(`La commande ${interaction.commandName} est introuvable.`);

            try {

                if (command.admin && !interaction.client.config.admin.includes(interaction.user.id)) {
                    return await interaction.reply({
                        content: `:x: Vous n'êtes pas autorisé à utiliser cette commande.`,
                        ephemeral: true
                    });
                }

                const { cooldowns } = interaction.client;

                if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

                const now = Date.now();
                const timestamps = cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown ?? 5) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return await interaction.reply({
                            content: `:x: Vous pourrez refaire la commande dans ${timeLeft.toFixed(1)} secondes.`,
                            ephemeral: true
                        });
                    }
                }

                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

                await command.execute(interaction);

            } catch (error) {
                console.error(error);
                return await interaction.reply({
                    content: ':x: Un problème est survenu lors de l\'exécution de la commande.',
                    ephemeral: true
                });
            }
        }
    }