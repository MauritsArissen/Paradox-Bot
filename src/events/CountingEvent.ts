import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { Bot } from "../client";
import { Message, TextChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";
import CountingHelper from "../util/CountingHelper";
import config from "../config";

@autoInjectable()
class CountingEvent implements IEvent {
	constructor(private client?: Bot, private prisma?: PrismaClient) {}

	getEventType(): string {
		return "messageCreate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(message: Message): Promise<any> {
		if (message.author.bot) return;
		if (message.channel.id !== config.countingChannelId) return;
		if (message.author.id === this.client.lastUser)
			return await message.delete();
		if (isNaN(parseInt(message.content))) return await message.delete();

		const number = parseInt(message.content);
		if (number !== this.client.lastCount + 1) return await message.delete();

		if (CountingHelper.isMilestone(number)) {
			await message.react("🎉");
		}

		this.client.lastCount = number;
		this.client.lastUser = message.author.id;

		await CountingHelper.addCountingLeaderboard(this.prisma, message.author);
	}
}

export default CountingEvent;
