import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { Bot } from "../client";
import { Message, TextChannel } from "discord.js";

@autoInjectable()
class CountingEvent implements IEvent {
	constructor(private client?: Bot) {}

	getEventType(): string {
		return "messageCreate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(message: Message): Promise<any> {
		if (message.author.bot) return;
		if (message.channel.id !== "1257749628573712505") return;
		if (message.author.id === this.client.lastUser)
			return await message.delete();
		if (isNaN(parseInt(message.content))) return await message.delete();

		const number = parseInt(message.content);
		if (number !== this.client.lastCount + 1) return await message.delete();

		if (this.isMilestone(number)) {
			await message.react("🎉");
		}

		this.client.lastCount = number;
		this.client.lastUser = message.author.id;
	}

	isMilestone(number) {
		if (number % 100 === 0) return true;

		// if (number > 100) {
		const str = number.toString();
		if (/^(.)\1+$/.test(str)) return true;
		// }

		return false;
	}
}

export default CountingEvent;
