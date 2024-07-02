import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../../client";
import ICommand from "../../interfaces/ICommand";

@autoInjectable()
class InfoCommand implements ICommand {
	constructor(private client?: Bot) {}

	getName(): string {
		return "info";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Get some bot info") as SlashCommandBuilder;
	}

	async hasPermissions(): Promise<boolean> {
		return true;
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		interaction.reply({
			content: "Info",
			ephemeral: true,
		});
	}
}

export default InfoCommand;
