require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const game = require('../modules/start');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { client } = require('../index.js');

module.exports = {
    name: 'start',
    data: new ButtonBuilder().setCustomId('start').setStyle(ButtonStyle.Primary).setLabel('Starten'),
    /**
     * @param { Interaction } interaction 
    */
    async execute(interaction) {   
        if(!mediaWriter.get('JSON', 'game', 'owner') == interaction.user.id) {
            interaction.reply({ content: 'Du hast das spiel nicht erstellt!', ephemeral: true});
            return;
        };

        if(mediaWriter.get('JSON', 'game', 'running') == true) {
            interaction.reply({ content: 'Das spiel läuft bereits!', ephemeral: true});
            return;
        };

        game.start(interaction);
    }
};