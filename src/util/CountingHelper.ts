import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

class CountingHelper {
	public static isMilestone(number: number) {
		if (number % 100 === 0) return true;

		if (number > 100) {
			const str = number.toString();
			if (/^(.)\1+$/.test(str)) return true;
		}

		return false;
	}

	public static async addCountingLeaderboard(
		prisma: PrismaClient,
		author: User,
	) {
		const existingRecord = await prisma.counting.findFirst({
			where: { userId: author.id },
		});

		await prisma.counting.upsert({
			where: { userId: author.id },
			create: { userId: author.id, count: 1 },
			update: { count: existingRecord ? existingRecord.count + 1 : 1 },
		});
	}
}

export default CountingHelper;
