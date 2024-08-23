const channelid = '1268633863886995630';
client.channels.fetch(channelid).then(async channel => {
    const connection = joinVoiceChannel({
        channelId: channelid,
        guildId: interaction.member.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('ready!');
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        console.log('Kaputt!');
    });

    player.on('idle', () => {
        searchAudio(client);
    });

    await searchAudio(client);
    return connection.subscribe(player);
}).catch(err => {console.error(err)});