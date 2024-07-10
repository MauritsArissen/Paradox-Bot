import { autoInjectable } from "tsyringe";
import IModal from "../../interfaces/IModal";
import { Bot } from "../../client";
import { ModalSubmitInteraction, TextChannel } from "discord.js";
import config from "../../config";

@autoInjectable()
class VerifyCharModal implements IModal {
	constructor(private client?: Bot) {}

	getCustomId(): string {
		return "verifychar";
	}

	async execute(interaction: ModalSubmitInteraction) {
		await interaction.reply({
			content:
				"Thank you for submitting the form! We will review it soon and get back to you.",
		});
		const guild = await this.client.guilds.fetch(config.guildId);
		const channel = (await guild.channels.fetch(
			"1250136546380746934",
		)) as TextChannel;

		const charName = interaction.fields.getTextInputValue("characterName");
		const officerHelp = interaction.fields.getTextInputValue("officerHelp");

		channel.send({
			content: `## New potential raider: ${charName}\n- Tag: **${interaction.user.tag}** (<@${interaction.user.id}>)\n- Officer help yet: **${officerHelp}**\n- [Armory & Talents](<https://ironforge.pro/pvp/player/Firemaw/${charName}/>)\n- [Warcraft Logs](<https://classic.warcraftlogs.com/character/eu/firemaw/${charName}>)`,
		});
	}
}

export default VerifyCharModal;
