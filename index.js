"use strict";
const cheerio = require("cheerio");
const request = require("request");
const signale = require("signale");
const _ = require("lodash");
const cfg = require("./config");

// !! CHANGE THIS WHEN UPDATING API
const dataHeaders = [
	"death_date",
	"class",
	"level",
	"base_fame",
	"total_fame",
	"experience",
	"equipment",
	"death_stats",
	"killed_by"
];

// wow this is shitty lol
function parseData(el, type, $) {
	switch (type) {
		case cfg.DATA.EQUIPMENT:
			return $(el).attr("title");
			break;
		default:
			return $(el).text();
			break;
	}
}

// todo add input sanitization
async function scrapeGraveyard(playerName, maxResults = 10) {
	let url = cfg.API_ENDPOINT + playerName;
	signale.debug("Url is: " + url);
	if (maxResults > 100) {
		signale.warn(
			"Currently, max number of results is 100...Clamping Value"
		);
		maxResults = 100;
	}
	signale.info(`Fetching ${maxResults} results`);
	return new Promise((resolve, reject) => {
		request(
			{
				url: url,
				headers: {
					"user-agent": cfg.USER_AGENT // need this to avoid being blacklisted by nginx
				}
			},
			(err, res, body) => {
				if (!err && res.statusCode == 200) {
					signale.success("Successfully loaded graveyard page");
					var $ = cheerio.load(body);
					let allEls = []; // stores cheerio stuff
					let graves = [];
					let raw_data = [[]];
					// dates
					// todo optimize strings
					let deathDates = $("#e > tbody > tr > td:nth-child(1)");
					let classes = $("#e > tbody > tr > td:nth-child(3)");
					let levels = $("#e > tbody > tr > td:nth-child(4)");
					let baseFame = $("#e > tbody > tr > td:nth-child(5)");
					let totalFame = $("#e > tbody > tr > td:nth-child(6)");
					let exp = $("#e > tbody > tr > td:nth-child(7)");
					let equipmentSets = $("#e > tbody > tr > td:nth-child(8)")
						.children("span")
						.children("a")
						.children("span");
					let deathStats = $(
						"#e > tbody > tr > td:nth-child(9) > span"
					);
					let killedBy = $("#e > tbody > tr > td:nth-child(10)");
					allEls.push(
						{ data: deathDates, type: cfg.DATA.DEATH_DATES },
						{ data: classes, type: cfg.DATA.CLASS },
						{ data: levels, type: cfg.DATA.LEVEL },
						{ data: baseFame, type: cfg.DATA.BASE_FAME },
						{ data: totalFame, type: cfg.DATA.TOTAL_FAME },
						{ data: exp, type: cfg.DATA.EXP },
						{ data: equipmentSets, type: cfg.DATA.EQUIPMENT },
						{ data: deathStats, type: cfg.DATA.DEATH_STATS },
						{ data: killedBy, type: cfg.DATA.KILLED_BY }
					);
					// reduce the number of results from the first 100 to the first $maxResults
					// and process stuff
					for (var i in allEls) {
						allEls[i].data = _.slice(allEls[i].data, 0, maxResults);

						raw_data[i] = []; // https://stackoverflow.com/a/17534346/3807967
						$(allEls[i].data).each((j, el) => {
							raw_data[i][j] = parseData(el, allEls[i].type, $);
						});
					}

					signale.info("Processing graves");
					// I LOVE U LODASH
					graves = _.reverse(
						_.map(_.zip(...raw_data), grave_arr => {
							return _.zipObject(dataHeaders, grave_arr);
						})
					);
					signale.success("Graves have been processed");
					resolve(graves);
				} else {
					signale.error(
						reject(
							new Error(
								"Could not get graveyard due to error" + err
							)
						)
					);
				}
			}
		);
	});
}

module.exports = scrapeGraveyard;
