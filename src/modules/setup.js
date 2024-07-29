require('dotenv').config();
const { Interaction, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, Colors } = require('discord.js');
const { client } = require('../index.js');
const mediaWriter = require('../mediaWriter.js');
const join = require('../buttons/join.js');
const start = require('../buttons/start.js');
const leave = require('../buttons/leave.js');

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

            let row = new ActionRowBuilder()
            .addComponents(join.data)
            .addComponents(leave.data)
            .addComponents(start.data);

            let embed = new EmbedBuilder()
            .setTitle('Neues Spiel!')
            .setDescription('Trit dem spiel mit dem Knopf `Beitreten` bei.')
            .setColor(Colors.Aqua);

            createChannel.send({embeds: [embed], components : [row]});

            mediaWriter.set('JSON', 'channels', 'category', createCategory.id);
            mediaWriter.set('JSON', 'channels', 'main', createChannel.id);
            mediaWriter.set('JSON', 'roles', 'member', createRole.id)
        } catch(error) {
            console.log(error);
            interaction.reply('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    }
};