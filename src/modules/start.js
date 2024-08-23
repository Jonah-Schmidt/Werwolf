require('dotenv').config();
const { Interaction } = require('discord.js');
const mediaWriter = require('../mediaWriter.js');
const { client, player } = require('../index.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    /**
     * @param {Interaction} interaction 
     */
    async start(interaction) {
        try {
            mediaWriter.set('JSON', 'game', 'running', true);
            console.log('Start!');

            //const track = '';
            //await queue.addTrack(track);

            //if(!queue.playing) await queue.play();

            //const currentTrack = queue.current;
            //queue.skip();

            //queue.destroy();

            //voice.channel.join().then((connection) => {
            //    connection.play(path.join('../audio/', 'test.m4a'));
            //})




            const channelid = '1268633863886995630';
            client.channels.fetch(channelid).then(async channel => {
                const connection = joinVoiceChannel({
                    channelId: channelid,
                    guildId: interaction.member.guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator
                });

                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log('ready!');
                });

                connection.on(VoiceConnectionStatus.Destroyed, () => {
                    console.log('Kaputt!');
                });

                player.on('idle', () => {
                    searchAudio(client);
                });

                await searchAudio(client);
                return connection.subscribe(player);
            }).catch(err => {console.error(err)});
        } catch(error) {
            console.log(error);
            interaction.channel.send('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    } 
};