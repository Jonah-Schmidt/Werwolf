require('dotenv').config();
const { Interaction, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, Colors } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { client } = require('../index.js');
const mediaWriter = require('../mediaWriter.js');
const join = require('../buttons/join.js');
const start = require('../buttons/start.js');
const leave = require('../buttons/leave.js');
const path = require('path');

module.exports = {
    /**
     * @param {Interaction} interaction 
     */
    async setup(interaction) {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        try {
            const createRole = await guild.roles.create({
                name: 'Mitspieler'
            });

            const createCategory = await guild.channels.create({
                name: 'Werwolf',
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {// @everyone
                        id: process.env.GUILD_ID,
                        deny: [
                            PermissionsBitField.Flags.ReadMessageHistory, 
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ]
                    }, {// Teilnehmer
                        id: createRole.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ],
                        deny: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.AttachFiles
                        ]
                    }
                ]
            });

            const createChannel = await guild.channels.create({
                name: 'Werwolf',
                type: ChannelType.GuildText,
                parent: createCategory.id,
                permissionOverwrites: [
                    {// @everyone
                        id: process.env.GUILD_ID,
                        allow: [
                            PermissionsBitField.Flags.ReadMessageHistory, 
                            PermissionsBitField.Flags.ViewChannel,
                        ],
                        deny: [
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.AttachFiles
                        ]
                    }
                ]
            });

            const createVoice = await guild.channels.create({
                name: 'Werwolf',
                type: ChannelType.GuildVoice,
                parent: createCategory.id,
                permissionOverwrites: [
                    {// @everyone
                        id: process.env.GUILD_ID,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ],
                        deny: [
                            PermissionsBitField.Flags.Connect
                        ]
                    },
                    {// Member
                        id: createRole.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.Connect
                        ]
                    }
                ]
            });

            let row = new ActionRowBuilder()
            .addComponents(join.data)
            .addComponents(leave.data)
            .addComponents(start.data);

            let embed = new EmbedBuilder()
            .setTitle('Neues Spiel!')
            .setDescription('Tritt dem spiel mit dem Knopf `Beitreten` bei.')
            .setColor(Colors.Aqua);

            createChannel.send({embeds: [embed], components : [row]});

            mediaWriter.set('JSON', 'channels', 'category', createCategory.id);
            mediaWriter.set('JSON', 'channels', 'voice', createVoice.id);
            mediaWriter.set('JSON', 'channels', 'main', createChannel.id);
            mediaWriter.set('JSON', 'roles', 'member', createRole.id);
            mediaWriter.set('Array', 'game', 'members', interaction.member.id);

            const connection = joinVoiceChannel({
                channelId: createVoice.id,
                guildId: process.env.GUILD_ID,
                adapterCreator: createVoice.guild.voiceAdapterCreator
            });

            const audio = path.join(__dirname, '../audio/test.mp3');
            const player = createAudioPlayer();
            const resource = createAudioResource();

            player.on('error', (error) => {
                console.error(error.message);
            });

            connection.subscribe(player);
            player.play(resource);

            mediaWriter.set('JSON', 'game', 'voice', createVoice.id);

            /*
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('Yippi');
            });
            */

            /*
            const player = createAudioPlayer();
            const resource = createAudioResource('../audio/test.mp3');
            player.play(resource);
            connection.subscribe(player);
            */

            const members = mediaWriter.get('Array', 'game', 'members');
            members.forEach(member => {
                const createMemberChannel = guild.channels.create({
                    name: member.displayname,
                    type: ChannelType.GuildVoice,
                    parent: createCategory.id,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel, 
                                PermissionsBitField.Flags.Connect
                            ]
                        },
                        {
                            id: guild.id,
                            deny: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.Connect
                            ]
                        }
                    ]
                });

                member.voice.setChannel(createMemberChannel);
                mediaWriter.set('Array', 'channels', 'member', createMemberChannel.id);
            });
        } catch(error) {
            console.log(error);
            interaction.reply('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    }
};