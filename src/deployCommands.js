require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const commands = [];
const commandFieles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

commandFieles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    commands.push(command.data.toJSON());
});

const restClient = new REST({version: '9'}).setToken(process.env.TOKEN);

restClient.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),{
    body: commands
}).then(() => console.log('Successfully registerd commands!')).catch(console.error);