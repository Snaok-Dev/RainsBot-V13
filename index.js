if (Number(process.version.slice(1).split(".")[0]) < 12) {
    throw new Error("La version de Node.js est inférieure à la 12.0.0. Veuillez vous mettre en v12.0.0 ou plus.");
}

const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [32767],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
  });
const moment = require('moment');
const { GiveawaysManager } = require('discord-giveaways');
const { loadCommands, loadEvents } = require('./util/loader');

require('dotenv').config();
require('./util/functions')(client);
client.config = require('./config');
client.mongoose = require('mongoose');
['commands', 'cooldowns'].forEach(x => client[x] = new Discord.Collection());


client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: client.config.embed.color,
        embedColorEnd: "RED",
        reaction: "🎉"
    }
});

loadCommands(client);
loadEvents(client);

const init = async () => {
    try {
        await client.mongoose.connect(process.env.DBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false
        });
        console.log('MongoDB s\'est connecté');
    } catch (error) {
        console.error('Erreur lors de la connexion à MongoDB :', error);
    }
};

init();

client.mongoose.connection.on('reconnected', () => {
    console.log('MongoDB s\'est reconnecté');
    client.channels.cache.get(client.config.support.logs).send('✅ **Le bot a réussi a se reconnecter à MongoDB**');
}).on('disconnected', () => {
    console.log('MongoDB s\'est déconnecté. Reconnection en cours...');
    client.channels.cache.get(client.config.support.logs).send('⚠️ **MongoDB s\'est déconnecté. Reconnection en cours...**');
}).on('reconnectTries', () => {
    console.error('[FATAL ERROR] Impossible de se reconnecter à MongoDB. Déconnection du bot...');
    client.channels.cache.get(client.config.support.logs).send('❌ **Impossible de se reconnecter à MongoDB. Déconnection du bot...**');
    client.destroy();
});

process.on('unhandledRejection', error => {
    console.error('Rejection non gérée :', error);
    client.channels.cache.get(client.config.support.logs).send(`[${moment().locale("fr").format('lll')}] [ERROR] \`\`\`${error.stack || error}\n\`\`\``);
});
process.on('warning', warn => {
    console.warn('Avertissement :', warn);
    client.channels.cache.get(client.config.support.logs).send(`[${moment().locale("fr").format('lll')}] [WARN] \`\`\`${warn}\n\`\`\``);
});

client.login(process.env.TOKEN);
