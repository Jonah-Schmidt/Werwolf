const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Interaction, Colors } = require('discord.js');
const mediaWriter = require('../mediaWriter');
const { client } = require('../index');

module.exports = {
    data: new SlashCommandBuilder().setName('cancle').setDescription('Ein fehlerhaftes spiel Abbrechen!'),
    /**
     * 
     * @param {Interaction} interaction 
     */
    async execute(interaction) {
        if(mediaWriter.get('JSON', 'game', 'owner') == interaction.member.id) {
            let embed = new EmbedBuilder()
            .setTitle('Das Spiel wurde abgebrochen!')
            .setColor(Colors.Green);

            interaction.reply({embeds: [embed]});

            mediaWriter.set('JSON', 'game', 'owner', false);
            mediaWriter.set('JSON', 'game', 'created', false);
            mediaWriter.set('JSON', 'game', 'running', false);

            const members = mediaWriter.get('Array', 'game', 'members');
            members.forEach(member => {
                mediaWriter.remove('Array', 'game', 'members', member);
            });

            const mainChannelID = mediaWriter.get('JSON', 'channels', 'main');
            const mainChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(mainChannelID);
            mainChannel.delete();
            mediaWriter.remove('JSON', 'channels', 'main', null);
            
            const categoryID = mediaWriter.get('JSON', 'channels', 'category');
            const category = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(categoryID);
            category.delete();
            mediaWriter.remove('JSON', 'channels', 'category', null);
            
            const memberRoleID = mediaWriter.get('JSON', 'roles', 'member');
            const memberRole = client.guilds.cache.get(process.env.GUILD_ID).roles.cache.get(memberRoleID);
            memberRole.delete();
            mediaWriter.remove('JSON', 'roles', 'member', null);
        } else {
            let embed = new EmbedBuilder()
            .setTitle('Fehler!')
            .setColor(Colors.Red);

            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
};