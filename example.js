const scrapeGraveyard = require('./index')

scrapeGraveyard('droidmxbro', 2).
	then(graves => console.log(graves))
