import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { PrismaClient } from "@prisma/client";
import { schedule } from "node-cron";
import { Bot } from "../client";
import Logger from "../util/Logger";
import { TextChannel } from "discord.js";

@autoInjectable()
class CountingScoreboardCronJobEvent implements IEvent {
	constructor(private client?: Bot, private prisma?: PrismaClient) {}

	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	async execute(): Promise<void> {
		schedule("*/5 * * * *", async () => {
			const date = new Date();

			const guild = await this.client.guilds.fetch("849739025999986708");
			if (!guild) return Logger.error("Guild not found");
			const channel = (await guild.channels.fetch(
				"1257749628573712505",
			)) as TextChannel;
			if (!channel) return Logger.error("Channel not found");

			const leaderboard = await this.prisma.counting.findMany({
				orderBy: {
					count: "desc",
				},
			});

			let leaderboardString = `**Counting Leaderboard**\n\n`;
			leaderboard.forEach((user, index) => {
				leaderboardString += `${index + 1}. <@${user.userId}> - ${
					user.count
				}\n`;
			});
			leaderboardString += `\n\nLast updated at ${date.toLocaleString()}`;

			await channel.setTopic(leaderboardString);
		});
	}
}

export default CountingScoreboardCronJobEvent;
