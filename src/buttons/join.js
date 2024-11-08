require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const { client } = require('../index');

module.exports = {
    name: 'join',
    data: new ButtonBuilder().setCustomId('join').setStyle(ButtonStyle.Success).setLabel('Beitreten'),
    /**
     * @param { Interaction } interaction 
    */
    async execute(interaction) {
        if(mediaWriter.get('JSON', 'game', 'running')) {
            interaction.reply({content: 'Das Spiel läuft bereits!', ephemeral: true});
            return;
        };
        const members = mediaWriter.get('Array', 'game', 'members');
        members.toString().includes
        if(members.toString().includes(interaction.user.id)) {
            interaction.reply({content: 'Du bist bereits dabei!', ephemeral: true});
        } else {
            mediaWriter.set('Array', 'game', 'members', interaction.user.id);
            interaction.reply({content: interaction.member.displayName +' ist dem Spiel Beigetreten!',});
            const memberRoleID = mediaWriter.get('JSON', 'roles', 'member');
            const memberRole = client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(memberRoleID);
            interaction.member.roles.add(memberRole);  
        };
    }
};