import { yellow } from "colorette";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";
import { Message, TextChannel } from "discord.js";

@autoInjectable()
class StartupCountingEvent implements IEvent {
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
	}
}

export default StartupCountingEvent;
