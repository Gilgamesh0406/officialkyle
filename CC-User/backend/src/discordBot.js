const { Client, GatewayIntentBits } = require("discord.js");
const { UserDiscordLink } = require("../models/index");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.on("guildMemberAdd", async (member) => {
  try {
    const verificationCode = generateVerificationCode();
    const discordId = member.id;

    // Check if a verification channel already exists for this user
    const existingChannel = member.guild.channels.cache.find(
      (channel) => channel.name === `verify-${member.user.username}`
    );

    // If channel already exists, don't create a new one
    if (existingChannel) {
      console.log(
        `Verification channel already exists for ${member.user.username}`
      );
      return;
    }
    console.log("Creating discord verification channel");

    try {
      // Create a private channel for the new member
      const privateChannel = await member.guild.channels.create({
        name: `verify-${member.user.username}`,
        type: 0, // Text channel
        permissionOverwrites: [
          {
            id: member.guild.id, // @everyone role
            deny: ["ViewChannel"],
          },
          {
            id: member.id,
            allow: ["ViewChannel", "ReadMessageHistory"],
          },
        ],
      });

      // Send verification message in private channel
      await privateChannel.send({
        content: `Welcome <@${member.id}>! Your verification code is: ${verificationCode}\nPlease use this code on our website to claim your bonus!`,
        embeds: [
          {
            color: 0x0099ff,
            title: "🎉 Welcome to the server!",
            description: `Your verification code: \`${verificationCode}\`\n\nHead back to our website to enter this code and claim your bonus!`,
            footer: {
              text: "This channel will be automatically deleted in 5 minutes",
            },
          },
        ],
      });

      // Delete the channel after 5 minutes
      setTimeout(async () => {
        try {
          // Check if channel still exists before attempting to delete
          const channelToDelete = member.guild.channels.cache.get(
            privateChannel.id
          );
          if (channelToDelete) {
            await channelToDelete.delete();
          }
        } catch (error) {
          console.error("Error deleting private channel:", error);
        }
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("Error creating private channel:", error);
    }

    const existingLink = await UserDiscordLink.findOne({
      where: { discord_id: discordId },
    });
    console.log(verificationCode);

    if (existingLink) {
      // Update existing link
      await UserDiscordLink.update(
        {
          verification_code: verificationCode,
        },
        {
          where: { discord_id: discordId },
        }
      );
    } else {
      // Create new link
      await UserDiscordLink.create({
        discord_id: discordId,
        verification_code: verificationCode,
      });
    }
  } catch (error) {
    console.error("Error handling new member:", error);
  }
});

function generateVerificationCode() {
  return Math.random().toString(36).substring(2, 15); // Simple random code
}
client.login(process.env.DISCORD_BOT_TOKEN);
