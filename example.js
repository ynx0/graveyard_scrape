const scrapeGraveyard = require('./index')

scrapeGraveyard('droidmxbro').
	then(graves => console.log(graves))
