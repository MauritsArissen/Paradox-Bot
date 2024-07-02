import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../../client";
import ICommand from "../../interfaces/ICommand";

@autoInjectable()
class TestCommand implements ICommand {
	constructor(private client?: Bot) {}

	getName(): string {
		return "test";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Dev command for @Htup") as SlashCommandBuilder;
	}

	async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
		return interaction.user.id === "244909794836611082";
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		interaction.reply("Hello, Htup!");
	}
}

export default TestCommand;
