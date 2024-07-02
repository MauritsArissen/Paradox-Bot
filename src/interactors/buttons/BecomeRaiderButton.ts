import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";
import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

@autoInjectable()
class BecomeRaiderButton implements IButton {
	getCustomId(): string {
		return "becomeRaider";
	}

	async execute(interaction: ButtonInteraction) {
		const modal = new ModalBuilder()
			.setCustomId("verifychar")
			.setTitle("'Wanna Become Raider' form");

		const characterNameInput = new TextInputBuilder()
			.setCustomId("characterName")
			.setLabel("Character Name")
			.setPlaceholder(
				"Enter your EXACT character name in-game. Including any special characters like ä, é, etc.",
			)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);

		const officerHelpInput = new TextInputBuilder()
			.setCustomId("officerHelp")
			.setLabel("Did you talk to an officer already?")
			.setPlaceholder(
				"Please fill out the officers name or 'No' if you haven't yet spoke to an officer.",
			)
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const firstActionRow =
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				characterNameInput,
			);
		const secondActionRow =
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				officerHelpInput,
			);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
	}
}

export default BecomeRaiderButton;
