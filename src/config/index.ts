import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
	token: process.env.TOKEN,
	logs: {
		level: process.env.LOGLEVEL || "silly",
	},
	databaseUrl: process.env.DB_URL,
	guildId: process.env.GUILD_ID || "849739025999986708",
	countingChannelId: process.env.COUNTING_CHANNEL_ID || "1257749628573712505",
	lootHistoryChannelId:
		process.env.LOOT_HISTORY_CHANNEL_ID || "1256254663523565640",
	officerRoleId: process.env.OFFICER_ROLE_ID || "849778354282692668",
	googleServiceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "",
};
