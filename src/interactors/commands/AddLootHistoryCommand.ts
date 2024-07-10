import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	GuildMember,
	SlashCommandBuilder,
} from "discord.js";
import config from "../../config";
import axios from "axios";
import ILootHistory from "../../interfaces/model/ILootHistory";
import { PrismaClient } from "@prisma/client";

@autoInjectable()
class AddLootHistoryCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "addloothistory";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Add loot history")
			.addAttachmentOption((option) =>
				option
					.setName("export")
					.setDescription("An json export of a certain day")
					.setRequired(true),
			) as SlashCommandBuilder;
	}

	async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
		let member = interaction.member as GuildMember;
		return member.roles.cache.some((role) => role.id === config.officerRoleId);
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const options: CommandInteractionOptionResolver =
			interaction.options as CommandInteractionOptionResolver;

		let attachment = options.getAttachment("export");
		const response = await axios.get(attachment.url);
		const data = response.data as ILootHistory[];

		for (const record of data) {
			switch (record.response) {
				case "Major Upgrade":
					record.response = "Big Upgrade";
					break;

				case "Off Spec":
					record.response = "Offspec";
					break;
			}

			await this.prisma.lootCouncilRecord.upsert({
				where: {
					id: record.id,
				},
				update: record,
				create: record,
			});
		}

		await interaction.reply({
			content: `Received and saved **${data.length} records**! Run \`/updateloothistory\` to update the spreadsheet...`,
			ephemeral: true,
		});
	}
}

export default AddLootHistoryCommand;
