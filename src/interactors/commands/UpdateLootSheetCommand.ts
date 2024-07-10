import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import { PrismaClient } from "@prisma/client";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import Logger from "../../util/Logger";
import config from "../../config";

@autoInjectable()
class UpdateLootSheetCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "updatelootsheet";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Update the officer loot sheet") as SlashCommandBuilder;
	}

	async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
		return interaction.user.id === "244909794836611082";
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		Logger.info("Running update loot history command...");
		Logger.info("\t1. Get loot records...");
		const records = await this.prisma.lootCouncilRecord.findMany({
			where: {
				response: {
					not: "Disenchant",
				},
			},
		});

		await interaction.reply({
			content:
				"Starting to update [loot history sheet](<https://docs.google.com/spreadsheets/d/1LbtSGOnHxUnJrtVx3tcJJFaNg03ON-eYyGqUPqFW-Hs>)...\n\n*This could take up to a couple of minutes*",
			ephemeral: false,
		});

		Logger.info("\t2. Connect to google spreadsheet...");
		const jwt = new JWT({
			email: "paradox-bot@maurits.iam.gserviceaccount.com",
			key: config.googleServiceAccountKey,
			scopes: [
				"https://www.googleapis.com/auth/spreadsheets",
				"https://www.googleapis.com/auth/drive.file",
			],
		});

		const doc = new GoogleSpreadsheet(
			"1LbtSGOnHxUnJrtVx3tcJJFaNg03ON-eYyGqUPqFW-Hs",
			jwt,
		);

		Logger.info("\t3. Load loot history sheet...");
		try {
			await doc.loadInfo();
		} catch (error) {
			Logger.error("Error loading the loot history sheet!", error);
			return;
		}

		const headerValues = [
			"Date",
			"Player",
			"Class",
			"ItemName",
			"EquipSlot",
			"Response",
			"Votes",
		];

		Logger.info("\t4. Create or update headers & sheet...");
		let lootHistorySheet = doc.sheetsByTitle["Loot History"];
		if (!lootHistorySheet) {
			lootHistorySheet = await doc.addSheet({
				title: "Loot History",
				headerValues,
			});
		} else {
			lootHistorySheet.setHeaderRow(headerValues);
		}

		Logger.info("\t5. Clear rows...");
		await lootHistorySheet.clearRows({ start: 2, end: 10000 });
		await lootHistorySheet.saveUpdatedCells();

		// await lootHistorySheet.resize({
		// 	rowCount: 100000,
		// 	columnCount: headerValues.length + 3,
		// });

		Logger.info("\t6. Add records...");
		const chunkSize = 50;
		for (let i = 0; i < records.length; i += chunkSize) {
			Logger.info(`\t\tAdding records ${i} to ${i + chunkSize}...`);
			await lootHistorySheet.addRows(
				records.slice(i, i + chunkSize).map((record) => ({
					Date: `${record.date} ${record.time}`,
					Player: record.player.split("-")[0],
					Response: record.response,
					EquipSlot: record.equipLoc,
					Class: record.class,
					Votes: record.votes,
					ItemName: record.itemName,
				})),
			);
		}

		await lootHistorySheet.loadCells("H1:J1");

		const rowAndFormula = [
			["H", "BIS"],
			["I", "Big Upgrade"],
			["J", "Offspec"],
		];

		Logger.info("\t7. Add formulas...");
		for (const [row, value] of rowAndFormula) {
			const cell = lootHistorySheet.getCellByA1(`${row}1`);
			cell.formula = `=ARRAYFORMULA(ALS($F1:$F100000="${value}"; 1; 0))`;
			cell.value = `=ARRAYFORMULA(ALS($F1:$F100000="${value}"; 1; 0))`;
		}

		Logger.info("\t8. Save updated cells...");
		await lootHistorySheet.saveUpdatedCells();

		Logger.info("Done updating the loot history sheet!");
	}

	async delay(ms: number) {
		await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
			() => {
				/* do nothing */
			},
		);
	}
}

export default UpdateLootSheetCommand;
