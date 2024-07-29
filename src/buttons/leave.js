require('dotenv').config();
const { Interaction, ButtonBuilder, ButtonStyle } = require("discord.js");
const mediaWriter = require('../mediaWriter');
const { client } = require('../index');

module.exports = {
    name: 'leave',
    data: new ButtonBuilder().setCustomId('leave').setStyle(ButtonStyle.Danger).setLabel('Verlassen'),
    /**
     * @param { Interaction } interaction
    */
    async execute(interaction) {   
        const members = mediaWriter.get('Array', 'game', 'members');
        if(members.toString().includes(interaction.user.id)) {
            mediaWriter.remove('Array', 'game', 'members', interaction.user.id);
            interaction.reply(interaction.member.displayName +' hat das Spiel Verlassen!');
            const memberRoleID = mediaWriter.get('JSON', 'roles', 'member');
            const memberRole = client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(memberRoleID);
            interaction.member.roles.remove(memberRole);  
        } else {
            interaction.reply({content: 'Du bist nicht im Spiel!', ephemeral: true});
        };
    }
};