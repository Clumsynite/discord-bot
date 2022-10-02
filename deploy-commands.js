// run this script to deploy commands
// run this only when something changes with these commands

const { REST, SlashCommandBuilder, Routes } = require("discord.js");
const { APPLICATION_ID, DEV_SERVER_ID, DISCORD_TOKEN } = require("./config");

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
  new SlashCommandBuilder().setName("server").setDescription("Replies with server info!"),
  new SlashCommandBuilder().setName("user").setDescription("Replies with user info!"),
  new SlashCommandBuilder().setName("beep").setDescription("Replies with boop!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(APPLICATION_ID, DEV_SERVER_ID), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);

// for guild-based commands
// rest
//   .delete(Routes.applicationGuildCommand(APPLICATION_ID, DEV_SERVER_ID, "1026140143976992870"))
//   .then(() => console.log("Successfully deleted guild command"))
//   .catch(console.error);

// // for global commands
// rest
//   .delete(Routes.applicationCommand(APPLICATION_ID, "1026140143976992870"))
//   .then(() => console.log("Successfully deleted application command"))
//   .catch(console.error);
