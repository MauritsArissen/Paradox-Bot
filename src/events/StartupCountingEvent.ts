import { yellow } from "colorette";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";
import { FetchMessagesOptions, Message, TextChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import CountingHelper from "../util/CountingHelper";

@autoInjectable()
class StartupCountingEvent implements IEvent {
	constructor(private prisma?: PrismaClient) {}

	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	async execute(client: Bot): Promise<void> {
		const guild = await client.guilds.fetch("849739025999986708");
		if (!guild) return Logger.error("Guild not found");
		const channel = await guild.channels.fetch("1257749628573712505");
		if (!channel) return Logger.error("Channel not found");
		const message = (
			await (channel as TextChannel).messages.fetch({ limit: 1 })
		).first();
		const number = parseInt(message.content);
		client.lastCount = number;
		client.lastUser = message.author.id;
		Logger.info(
			`Startup counting event executed! Last count is ${yellow(
				client.lastCount.toString(),
			)} and last user is ${yellow(client.lastUser)}`,
		);

		if ((await this.prisma.counting.count()) === 0) {
			Logger.warn("Counting leaderboard is empty... Trying to fill it up");
			const messages = await this.fetchAllMessages(channel as TextChannel);

			for (const msg of messages) {
				if (msg.author.bot) continue;
				await CountingHelper.addCountingLeaderboard(this.prisma, msg.author);
			}

			Logger.info(
				"Counting leaderboard was filled with all messages! Total messages: " +
					messages.length,
			);
		}
	}

	async fetchAllMessages(channel): Promise<Message[]> {
		let allMessages = [];
		let lastMessageId = null;
		let fetchComplete = false;

		while (!fetchComplete) {
			const options: FetchMessagesOptions = { limit: 50 };
			if (lastMessageId) {
				options.before = lastMessageId;
			}

			const messages = await channel.messages.fetch(options);
			if (messages.size === 0) {
				fetchComplete = true;
			} else {
				allMessages = allMessages.concat(Array.from(messages.values()));
				lastMessageId = messages.last().id;
			}
		}

		return allMessages;
	}
}

export default StartupCountingEvent;
