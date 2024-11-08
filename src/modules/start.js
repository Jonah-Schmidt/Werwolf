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
            const voiceChannelID = mediaWriter.get('JSON', 'channels', 'voice');
            const voiceChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(voiceChannelID);

            const members = Array.from(voiceChannel.members.values());
            const memberIDS = members.map(member => member.user.id);

            console.log(members);
            if(!members.length >= 4) {
                interaction.reply({ content: 'Es gibt nicht genug Spieler!', ephemeral: true});
            }

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
        } catch(error) {
            console.log(error);
            interaction.channel.send('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    } 
};