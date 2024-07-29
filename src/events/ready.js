const { Client, EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    /**
     * @param {Client} client
    */
    async execute(client) {
        try {
            console.log(`Client loggin as ${client.user.tag}`);
            console.log('-----------------------------------');
        } catch (error) {
            console.log(error);
        };
    }
};