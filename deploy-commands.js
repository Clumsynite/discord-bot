// run this script to deploy commands
// run this only when something changes with these commands

const fs = require("fs");
const path = require("path");

const { REST, Routes } = require("discord.js");
const { APPLICATION_ID, DEV_SERVER_ID, DISCORD_TOKEN } = require("./config");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

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
