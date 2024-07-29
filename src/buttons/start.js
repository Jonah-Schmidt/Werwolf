require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const game = require('../modules/start');

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
        } else {
            interaction.reply('Du hast das spiel nicht erstellt!');
        };
    }
};