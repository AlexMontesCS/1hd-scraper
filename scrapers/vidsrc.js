const axios = require("axios");
const cheerio = require("cheerio")

/*
        var mediaDetails = {source: "1hd.to", link: filmLink, name: filmTitle, serverId, rabbitId, type };

        if(episodeName) 
            mediaDetails.episodeName = episodeName;
        
        return mediaDetails

*/

async function getStreams(id) {
    var streams = await axios.get("https://vidsrc-eta-ten.vercel.app/streams/" + id)

}