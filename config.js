'use strict';
module.exports = {
	API_ENDPOINT: 'https://www.realmeye.com/graveyard-of-player/',
	USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
	// !! CHANGE THIS WHEN UPDATING API
	DATA: Object.freeze({
		DEATH_DATE: "death_date",
		CLASS: "class",
		LEVEL: "level",
		BASE_FAME: "base_fame",
		TOTAL_FAME: "total_fame",
		EXP: "experience",
		EQUIPMENT: "equipment",
		DEATH_STATS: "death_stats",
		KILLED_BY: "killed_by"
	})
}