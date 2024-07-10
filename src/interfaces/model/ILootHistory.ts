interface ILootHistory {
	id: string;
	player: string;
	date: string;
	time: string;
	itemID: number;
	itemString: string;
	response: string;
	votes: number;
	class: string;
	instance: string;
	boss: string;
	gear1: string;
	gear2: string;
	responseID: string;
	isAwardReason: string;
	rollType: string;
	subType: string;
	equipLoc: string;
	note: string;
	owner: string;
	itemName: string;
}

export default ILootHistory;
