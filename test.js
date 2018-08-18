"use strict";
import test from "ava";
const scrape = require("./index.js").scrapeGraveyard;

test("Valid data has been received", t => {
	t.truthy(scrape("droidmxbro"));
});

test("Correct number of graves has been received", async t => {
	let graves = await scrape('droidmxbro', 2)
	t.true(graves.length == 2)
});
