const scrape = require('./index').scrapeGraveyard 


// get the first 2 deaths/graveyards
scrape('droidmxbro', 2).
	then(graves => console.log(graves))

// or use async/await :D
async function getFirstDeathDate() {
	let graves = await scrape('droidmxbro')
	let killedBy = graves[0].killed_by
	console.log(`droidmxbro bro was killed by ${killedBy}.`)
	return killedBy
}

getFirstDeathDate()