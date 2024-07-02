import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	GuildMember,
	MessageActionRowComponentBuilder,
} from "discord.js";

@autoInjectable()
class WannaBecomeRaiderObtainEvent implements IEvent {
	getEventType(): string {
		return "guildMemberUpdate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
		if (
			!oldMember.roles.cache.has("1253327130972913684") &&
			newMember.roles.cache.has("1253327130972913684")
		) {
			const becomeRaider = new ButtonBuilder()
				.setCustomId("becomeRaider")
				.setLabel("Become a Raider")
				.setStyle(ButtonStyle.Primary);

			const row =
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					becomeRaider,
				);

			newMember.send({
				content: `Hello **${
					newMember.user.displayName || newMember.user.globalName
				}**!\n\nThank you for showing interest in raiding with us. Please click the button below to fill out the quick form. **Good luck**!`,
				components: [row],
			});
		}
	}
}

export default WannaBecomeRaiderObtainEvent;
