const { Interaction, InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { commands, buttons, client } = require('../index.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        try {
            // Command
            if(interaction.type == InteractionType.ApplicationCommand) {
                const command = commands.get(interaction.commandName);
        
                if(command) {
                    await command.execute(interaction);
                };
            }
            // Button
            else if(interaction.isButton()) {
                const button = buttons.get(interaction.customId);
                const file = require(`../buttons/${interaction.customId}.js`);
        
                if(button) {
                    await file.execute(interaction);
                };
            }
        } catch(error) {
            console.log(error);
            if(interaction.deferred || interaction.replied) {
                interaction.editReply('Es ist eine Fehler aufgetreten !\n```' + error + '```');
            } else {
                interaction.reply('Es ist eine Fehler aufgetreten !\n```' + error + '```');
            };
        };
    }
};