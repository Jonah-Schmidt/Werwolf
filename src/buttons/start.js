require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const game = require('../modules/game');

module.exports = {
    name: 'start',
    data: new ButtonBuilder().setCustomId('start').setStyle(ButtonStyle.Primary).setLabel('Starten'),
    /**
     * @param { Interaction } interaction 
    */
    async execute(interaction) {   
        if(mediaWriter.get('JSON', 'game', 'owner') == interaction.user.id) {
            interaction.reply('Das Spiel wurde gestartet!');
            game.start(interaction);
        } else {
            interaction.reply('Du hast das spiel nicht erstellt!');
        };
    }
};