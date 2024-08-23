require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
], partials: [
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.Message, 
    Partials.Reaction, 
    Partials.User
]});
const { createAudioPlayer } = require('@discordjs/voice');
const fs = require('fs');
const player = createAudioPlayer();
const commands = new Collection(); // HashMap (key, value)
const buttons = new Collection();
module.exports = { commands, buttons, client, player };
const commandFieles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const buttonFiles = fs.readdirSync('./src/buttons').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
require('./deployCommands.js');
commandFieles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    console.log(`Registered Command : ${command.data.name}`);
    commands.set(command.data.name, command);
});
console.log('-----------------------------------');
buttonFiles.forEach(buttonFile => {
    const button = require(`./buttons/${buttonFile}`);
    buttons.set(button.name, button.execute);
    console.log(`Registered Button : ${button.name}`);
});
console.log('-----------------------------------');
eventFiles.forEach(eventFile => {
    const event = require(`./events/${eventFile}`);
    console.log(`Registered Event : ${event.name}`);
    client.on(event.name, (...args) => event.execute(...args));
});
console.log('-----------------------------------');
client.login(process.env.TOKEN);