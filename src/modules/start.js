require('dotenv').config();
const { Interaction } = require('discord.js');
const mediaWriter = require('../mediaWriter.js');
const { client } = require('../index.js');

module.exports = {
    /**
     * @param {Interaction} interaction 
     */
    async start(interaction) {
        try {
            const guild = client.guilds.cache.get(process.env.GUILD_ID)

            const voiceChannelID = mediaWriter.get('JSON', 'channels', 'voice');
            const voiceChannel = guild.channels.cache.get(voiceChannelID);

            const members = Array.from(voiceChannel.members.values());
            const memberIDS = members.map(member => member.user.id);

            if(members.length >= 4) {
                const players = mediaWriter.get('Array', 'game', 'members');
                var allPlayersInChannel = true;
    
                memberIDS.forEach(member => {
                    if(!players.includes(member)) {
                        allPlayersInChannel = false
                    };
                });
    
                if(allPlayersInChannel) {
                    mediaWriter.set('JSON', 'game', 'running', true);
                    interaction.reply('Das Spiel wurde gestartet!');
                } else {
                    interaction.reply({ content: 'Es sind nicht alle nutzer im Voice Channel!', ephemeral: true});
                };
            } else {
                interaction.reply({ content: 'Es gibt nicht genug Spieler!', ephemeral: true});
            }

            
            const activeMembers = mediaWriter.get('Array', 'game', 'members');
            activeMembers.forEach(member => {
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
            interaction.channel.send('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    } 
};