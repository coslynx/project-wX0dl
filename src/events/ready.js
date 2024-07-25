const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { token } = require('./config/config.js');
const { createEmbed } = require('./utils/embed.js');
const { logger } = require('./utils/logger.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Define the bot's prefix
const prefix = '!';

// Initialize the music player
let player;

// Function to handle music playback
async function playMusic(guildId, queue) {
    if (!queue || queue.length === 0) {
        return;
    }

    // Get the next song from the queue
    const song = queue.shift();

    // Create the audio player
    player = createAudioPlayer();

    // Get the audio resource
    const resource = await createAudioResource(song.url, {
        inputType: StreamType.Arbitrary,
    });

    // Connect to the voice channel
    const connection = joinVoiceChannel({
        channelId: song.channelId,
        guildId: guildId,
        adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator
    });

    // Subscribe the player to the connection
    connection.subscribe(player);

    // Play the audio resource
    player.play(resource);

    // Log the playing song
    logger.info(`Now playing: ${song.title} - ${song.url}`);

    // Send a message to the channel
    const channel = client.channels.cache.get(song.channelId);
    channel.send({ embeds: [createEmbed('Now Playing', `${song.title}\n${song.url}`)] });

    // Add an event listener for the end of the song
    player.on('finish', () => {
        // Play the next song in the queue
        playMusic(guildId, queue);
    });

    // Add an event listener for errors
    player.on('error', (error) => {
        logger.error(`An error occurred while playing the music: ${error}`);

        // Send an error message to the channel
        channel.send({ embeds: [createEmbed('Error', `An error occurred while playing the music: ${error}`)] });

        // Play the next song in the queue
        playMusic(guildId, queue);
    });
}

// Add a listener for the 'ready' event
client.on('ready', () => {
    logger.info(`Bot is ready!`);
});

// Add a listener for the 'messageCreate' event
client.on('messageCreate', async (message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Check if the message starts with the prefix
    if (!message.content.startsWith(prefix)) return;

    // Extract the command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Handle music commands
    switch (command) {
        case 'play': {
            // Get the search query
            const query = args.join(' ');

            // Search for music
            const song = await ytdl.getInfo(query);

            // Add the song to the queue
            const guildId = message.guild.id;
            const queue = message.guild.queue || [];
            queue.push({
                url: song.videoDetails.video_url,
                title: song.videoDetails.title,
                channelId: message.member.voice.channel.id
            });
            message.guild.queue = queue;

            // Start playback if the queue is empty
            if (queue.length === 1) {
                playMusic(guildId, queue);
            } else {
                message.channel.send({ embeds: [createEmbed('Added to Queue', `${song.videoDetails.title}`)] });
            }
            break;
        }

        // Add other music commands (skip, stop, queue, pause, resume, volume, loop, shuffle, lyrics)
        // Each command will follow a similar pattern of:
        // 1. Get the current player instance
        // 2. Call the appropriate method on the player
        // 3. Send a success or error message to the channel

        default: {
            message.channel.send({ embeds: [createEmbed('Invalid Command', `Invalid command: ${command}`)] });
        }
    }
});

// Login the bot
client.login(token);