const { addonBuilder } = require("stremio-addon-sdk")
const {getNameFromImdb} = require("./utils.js")
const oneHd = require("./scrapers/1hd.js");

const manifest = {
	"id": "community.1hd",
	"version": "0.0.1",
	"catalogs": [],
	"resources": ["stream"],
	"types": [
		"movie", "series"
	],
	"name": "1hd",
	"description": "scrape from 1hd.to"
}
const builder = new addonBuilder(manifest)


builder.defineStreamHandler(async function(args) {

	var name = await getNameFromImdb(args.id)
	var episodeObject;
	if(args.type == "series") {
		var season = args.id.split(":")[1]
		var episode = args.id.split(":")[1]
		episodeObject = {season, episode};
	}
	var response = await oneHd.getAll(name, args.type, episodeObject);
	var streams = [];
//{file: streams[resolution], type: 'hls', resolution}
	response.forEach(x => {
		if(x.name != name) 
			return;
		x.sources.videoSources.forEach(y => {
			streams.push({url: y.file, name: x.episodeName || x.name, description: `🌐 Source: ${x.source} \n🎬 Resolution: ${y.resolution}`}) //Change x.name to episode name
		})
	});
	return Promise.resolve({ streams })
})


module.exports = builder.getInterface()