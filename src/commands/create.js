const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Interaction, ActionRowBuilder, Colors } = require('discord.js');
const mediaWriter = require('../mediaWriter');
const game = require('../modules/setup');

module.exports = {
    data: new SlashCommandBuilder().setName('create').setDescription('Erstelle ein Spiel.'),
    /**
     * 
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        if(!mediaWriter.get('JSON', 'game', 'created')) {
            interaction.reply({content: 'Das Spiel wurde Erstellt', ephemeral: true})

            mediaWriter.set('JSON', 'game', 'owner', interaction.member.id);
            mediaWriter.set('JSON', 'game', 'created', true);
            mediaWriter.set('JSON', 'game', 'running', false);
            
            game.setup(interaction);
        } else {
            let embed = new EmbedBuilder()
            .setTitle('Fehler!')
            .setDescription('Es läuft bereits ein Spiel!')
            .setColor(Colors.Red);

            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
};