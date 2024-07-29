require('dotenv').config();
const { Interaction } = require('discord.js');
const mediaWriter = require('../mediaWriter.js');

module.exports = {
    /**
     * @param {Interaction} interaction 
     */
    async start(interaction) {
        try {
            mediaWriter.set('JSON', 'game', 'running', true);
            console.log('Start!');
        } catch(error) {
            console.log(error);
            interaction.reply('Es ist ein Fehler aufgetreten!\n```' + error + '```');
        };
    } 
};