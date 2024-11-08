require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const game = require('../modules/start');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    name: 'start',
    data: new ButtonBuilder().setCustomId('start').setStyle(ButtonStyle.Primary).setLabel('Starten'),
    /**
     * @param { Interaction } interaction 
    */
    async execute(interaction) {   
        if(mediaWriter.get('JSON', 'game', 'owner') == interaction.user.id) {
            game.start(interaction);
            interaction.reply('Das Spiel wurde gestartet!');

            /*
            const connection = mediaWriter.get('JSON', 'game', 'voice');
            const player = createAudioPlayer();
            const resource = createAudioResource('../audio/test.mp3');
            player.play(resource);
            connection.subscribe(player);
            */
        } else {
            interaction.reply({ content: 'Du hast das spiel nicht erstellt!', ephemeral: true});
        };
    }
};