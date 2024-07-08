const axios = require("axios");
const cheerio = require("cheerio");
const BASE_URL = 'https://1hd.to';


async function fetchHTML(url) {
    try {
        const response = await axios.get(url);
        return cheerio.load(response.data);
    } catch (error) {
        // console.error(`Failed to fetch HTML from ${url}:`);
        return "<p></p>"; // Return empty html to indicate the fetch was unsuccessful
    }
}


async function scrapeId(movieTitle, reqType, season, episode) {
    const url = `${BASE_URL}/search?keyword=${encodeURIComponent(movieTitle)}`;
    const $ = await fetchHTML(url);
    const detailPromises = $('.item-film a').map(async (_, element) => {
        var parent = $(element).closest('.item-film');
        var spans = parent.find('.film-info span');
        var type = spans.eq(0).text().split(" ").pop().toLowerCase()
        if(type != reqType) return;
        return fetchMediaDetails($(element), type, season, episode);
    }).get();

    return Promise.all(detailPromises).then(results => results.filter(Boolean));
}

async function getMovieServerId(filmLink) {
        // Fetch the HTML of the movie details page, handling redirects
        const response = await axios.get(filmLink, {
            maxRedirects: 5,  // Allow up to 5 redirects
            validateStatus: status => status >= 200 && status <= 404 // Accept only HTTP success status
        });

        // After all redirects, extract the final URL
        var finalUrl = response.request.res.responseUrl;
        // Extract serverId from the final URL path
        var serverId = finalUrl.split('/').pop();
        return serverId
}
async function fetchMediaDetails(element, type, season = 1, episode = 2) {

    const filmTitle = element.attr('title');
    var filmLink;
    var serverId;
    if(!filmTitle) return;
    if(type == "series") {
        filmLink = `${BASE_URL}${element.attr('href')}`; //bring to page where episodes can be parsed
        filmLink = await getEpisodeLink(filmLink, season, episode)
        serverId = filmLink ? filmLink.split("/").pop() : null;
    } else {
        filmLink = `${BASE_URL}${element.attr('href').replace("/movie/", "/watch-movie/")}`;
        serverId = await getMovieServerId(filmLink)
    }
        console.log(serverId)
        // Proceed with fetching the Rabbit ID if necessary
        const rabbitId = await getRabbbitId(serverId);

        return { link: filmLink, name: filmTitle, serverId, rabbitId, type };

}

async function getRabbbitId(serverId) {
    if(serverId === null || isNaN(serverId)) return null;
    const url = `${BASE_URL}/ajax/movie/episode/servers/${serverId}`;
    console.log(url)
    const $ = await fetchHTML(url);
    if($){
        const rabbitRetrieveCode = $('a').first().attr('data-id');
        const rabbitIdResponse = await axios.get(`${BASE_URL}/ajax/movie/episode/server/sources/${rabbitRetrieveCode}`);
        return rabbitIdResponse.data.data.link.split("/").pop().split("?")[0];
    }
}

async function getEpisodeLink(filmLink, season, episode) {
    var $ = await fetchHTML(filmLink);
    var seasonId = (await getSeasons(filmLink))[season]
    if(!seasonId) return null;
    var $ = await fetchHTML(`${BASE_URL}/ajax/movie/season/episodes/${seasonId}`)
    var episodes = {};

    var episodeElements = $("span");

    for(var i = 0; i < episodeElements.length; i+=2) {
        episodes[i/2 + 1] = episodeElements[i + 1].parent.parent.attribs['data-id']
    }

    return filmLink.replace("series", "watch-series") + "/" + episodes[episode];
}

async function getSeasons(filmLink) {
    var seriesId = filmLink.split("-").pop();
    var $ = await fetchHTML(`${BASE_URL}/ajax/movie/seasons/${seriesId}`);
    var seasons = {}
    var count = 1
    
    for(var x of $("a")) {
        x.attribs ? seasons[count] = x.attribs['data-id'] : null
        count++
    };
    return seasons;
}
scrapeId("House of the dragon", "series", 1, 1).then(console.log)
      //https://1hd.to/watch-series/watch-the-boys-online-33895/1451515

     
/*
https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/playlist.m3u8

https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/1080/index.m3u8

*/
       

