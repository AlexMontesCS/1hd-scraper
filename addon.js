const { addonBuilder } = require("stremio-addon-sdk")
const {getAll, getNameFromImdb} = require("./scraper.js")

const manifest = {
	"id": "community.1hd",
	"version": "0.0.1",
	"catalogs": [],
	"resources": ["stream"],
	"types": [
		"movie"
	],
	"name": "1hd",
	"description": "scrape from 1hd.to"
}
const builder = new addonBuilder(manifest)


builder.defineStreamHandler(async function(args) {
	var name = await getNameFromImdb(args.id)
	var response = await getAll(name)
	var streams =  response.map(stream => ({url: stream.sources.videoSources[0]?.file, name: stream.name, description: "Scraped from 1hd.to"}));
	streams = streams.filter(x => x.name == name)
	return Promise.resolve({ streams })
})
module.exports = builder.getInterface()