const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Interaction, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Ping!'),
    /**
     * 
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        let embed = new EmbedBuilder()
        .setTitle('Pong!')
        .setColor(Colors.Aqua);

        interaction.reply({embeds: [embed], ephemeral: true});
    }
};