const mongoose = require('mongoose');
const Guild = require('../models/Guild');

module.exports = async client => {
    client.createGuild = async guild => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, guild);
        const createGuild = await new Guild(merged);
        createGuild.save();
    }

    client.getGuild = async guild => {
        const data = await Guild.findOne({ id: guild.id })
        if(data) return data;
        return null;
    }

    client.updateGuild = async (guild, data) => {
        let data_ = await client.getGuild(guild);
        if(typeof data_ !== "object") data_ = {};
        for (const key in data) {
            if(data_[key] !== data[key]) data_[key] = data[key];
        }
        return data_.updateOne(data);
    }
    
    client.getAllUsers = () => {
        let size = 0;
        client.guilds.cache.forEach(g => {
            size = size + g.memberCount;
        })
        return String(size).replace(/(.)(?=(\d{3})+$)/g, '$1 ');
    }
}