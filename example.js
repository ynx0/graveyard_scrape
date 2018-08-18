const scrapeGraveyard = require('./index')
// get the first 2 deaths/graveyards

scrapeGraveyard('droidmxbro', 2).
	then(graves => console.log(graves))
