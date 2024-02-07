const { model, Schema } = require('mongoose');
const config = require('../config');

module.exports = model('Guild', new Schema(
    {
        _id: Schema.Types.ObjectId,
        id: String,
        lang: {
            type: String,
            default: config.defaultsSettings.lang
        },
        prefix: {
            type: String,
            default: config.prefix
        },
        members: [],
        locked_channels: {
            type: Array,
            default: []
        },
        plugins: {
            type: Object,
            default: {
                protection: {
                    raidmode: false,
                    antigiverole: false,
                    antiban: false,
                    antilink: false,
                    antimaj: false,
                    antispam: {
                        enabled: false
                    },
                    ignored_channels: [],
                    ignored_roles: [],
                    captcha: {
                        enabled: false,
                        verif_channel: null,
                        not_verified_role: null,
                        difficulty_level: 0
                    }
                },
                welcome: {
                    enabled: false,
                    message: config.defaultsSettings.welcomeMessage,
                    image: false,
                    channel: null
                },
                goodbye: {
                    enabled: false,
                    message: config.defaultsSettings.goodbyeMessage,
                    image: false,
                    channel: null
                },
                logs: {
                    enabled: false,
                    channel: null
                },
                autorole: {
                    enabled: false,
                    role: null,
                    botRole: null
                },
                suggestion: {
                    enabled: false,
                    channel: null
                },
                economy: {
                    enabled: true,
                    currency: "$"
                },
                levels: {
                    enabled: true,
                    level_up_channel: null,
                    level_up_message: null,
                    roles_rewards: []
                },
                privatechannels: {
                    channelID: null,
                    parentID: null
                },
                membercount: {
                    channels: {
                        members: {
                            name: null,
                            id: null
                        },
                        bots: {
                            name: null,
                            id: null
                        },
                        totalMembers: {
                            name: null,
                            id: null
                        }
                    },
                    parentID: null
                },
                tickets: {
                    panels: [],
                    transcripts_channel: null,
                    logs_channel: null
                }
            }
        },
        muterole: {
            type: String,
            default: null
        },
        lastBanTimestamp: {
            type: Number,
            default: null
        },
        lastBanExecutor: {
            type: String,
            default: null
        }
    }
));