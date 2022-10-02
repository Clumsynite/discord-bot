require("dotenv").config();

const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  INVITE_URL: process.env.INVITE_URL,
  APPLICATION_ID: process.env.APPLICATION_ID,
  DEV_SERVER_ID: process.env.DEV_SERVER_ID,
};

module.exports = CONFIG;
