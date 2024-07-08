//1HD SCRAPER. todo: ADD ORTHOGANALITY 

const axios = require("axios");
const cheerio = require("cheerio");
const decode  = require("../decoder/decode.js")
const BASE_URL = 'https://1hd.to';

/**
 * Fetch HTML from a URL and load it into cheerio for parsing.
 * @param {string} url - The URL to fetch HTML from.
 * @returns {Promise<CheerioStatic>} - A cheerio loader instance.
 */
/**
 * Fetch HTML from a URL and load it into cheerio for parsing.
 * @param {string} url - The URL to fetch HTML from.
 * @returns {Promise<CheerioStatic|null>} - A cheerio loader instance or null if an error occurs.
 */
async function fetchHTML(url) {
    try {
        const response = await axios.get(url);
        return cheerio.load(response.data);
    } catch (error) {
        console.error(`Failed to fetch HTML from ${url}:`);
        return "<p></p>"; // Return empty html to indicate the fetch was unsuccessful
    }
}

//TODO make sort of enum (does js have?) for reqType
/**
 * Fetch and parse movie details from the search results page.
 * @param {string} movieTitle - The movie title to search for.
 * @param {string} reqType - Either "movie" or "series" 
 * @param {Object} episodeObject - { season: {num}, episode: {num} }
 * @returns {Promise<Array>} - A promise that resolves to an array of movie objects.
 */
async function scrapeId(movieTitle, reqType, episodeObject) {
    const url = `${BASE_URL}/search?keyword=${encodeURIComponent(movieTitle)}`;
    const $ = await fetchHTML(url);
    const detailPromises = $('.item-film a').map(async (_, element) => {
        var parent = $(element).closest('.item-film');
        var spans = parent.find('.film-info span');
        var type = spans.eq(0).text().split(" ").pop().toLowerCase()
        if(type != reqType) return;
        return fetchMediaDetails($(element), type, episodeObject);
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

/**
 * Fetch movie details for each movie element including handling redirects to capture the server ID.
 * @param {CheerioElement} element - A cheerio element representing the movie link.
 * @returns {Promise<Object|null>} - A promise that resolves to a movie object with detailed information or null if an error occurs.
 */
async function fetchMediaDetails(element, type, episodeObject) {
    const filmTitle = element.attr('title');
    var filmLink;
    var serverId;
    var episodeName;
    if(!filmTitle) return;
    if(type == "series") {
        filmLink = `${BASE_URL}${element.attr('href')}`; //bring to page where episodes can be parsed
        episodeDetails = await getEpisodeLink(filmLink, episodeObject.season, episodeObject.episode)
        filmLink = episodeDetails?.link;
        episodeName = episodeDetails?.name;
        serverId = filmLink ? filmLink.split("/").pop() : null;
    } else {
        filmLink = `${BASE_URL}${element.attr('href').replace("/movie/", "/watch-movie/")}`;
        serverId = await getMovieServerId(filmLink)
    }
        // Proceed with fetching the Rabbit ID if necessary
        const rabbitId = await getRabbbitId(serverId);
        var mediaDetails = {source: "1hd.to", link: filmLink, name: filmTitle, serverId, rabbitId, type };

        if(episodeName) 
            mediaDetails.episodeName = episodeName;
        
        return mediaDetails
}
/**
 * Retrieve a unique streaming identifier from a movie's server ID.
 * @param {string} serverId - The server ID.
 * @returns {Promise<string>} - A promise that resolves to the Rabbit ID.
 */
async function getRabbbitId(serverId) {
    if(serverId === null || isNaN(serverId)) return null;
    const url = `${BASE_URL}/ajax/movie/episode/servers/${serverId}`;
    const $ = await fetchHTML(url);
    if($){
        const rabbitRetrieveCode = $('a').first().attr('data-id');
        if(rabbitRetrieveCode) {
            const rabbitIdResponse = await axios.get(`${BASE_URL}/ajax/movie/episode/server/sources/${rabbitRetrieveCode}`);
            return rabbitIdResponse.data.data.link.split("/").pop().split("?")[0];
        }
    }
}

//TODO comment
async function getEpisodeLink(filmLink, season, episode) {
    var seasonId = (await getSeasons(filmLink))[season]
    if(!seasonId) return null;
    var $ = await fetchHTML(`${BASE_URL}/ajax/movie/season/episodes/${seasonId}`)
    var episodes = {};

    var episodeElements = $("span");

    for(var i = 0; i < episodeElements.length; i+=2) {  
        episodes[i/2 + 1] = {id: episodeElements[i + 1].parent.parent.attribs['data-id'], name: episodeElements[i + 1].children[0].data}
    }

    if(!episodes[episode]) return null;
    return {link: filmLink.replace("series", "watch-series") + "/" + episodes[episode].id, name: episodes[episode].name};
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

/**
 * Fetch video and caption sources for a movie based on its Rabbit ID.
 * @param {string} rabbitId - The Rabbit ID.
 * @returns {Promise<Object>} - A promise that resolves to an object containing video and caption sources.
 */
async function getSources(rabbitId) {
    var results = await decode(rabbitId);
    var playlistLink = results.videoSources[0].file;
    var streams = await getStreams(playlistLink);
    results.videoSources = []

    for(var resolution in streams) {
        results.videoSources.push({file: streams[resolution], type: 'hls', resolution})
    }
    return results;
}

/**
 * Fetch all available details for movies matching a given name.
 * @param {string} movieName - The name of the movie.
 * @returns {Promise<Array>} - A promise that resolves to an array of detailed movie objects.
 */
async function getAll(movieName, type, episodeObject = {season: 0, episode: 0}) {
    try {
        const movies = await scrapeId(movieName, type, episodeObject);
        const finalArray = await Promise.all(movies.map(async movie => {
            if (movie.rabbitId) {
                const sources = await getSources(movie.rabbitId);
                return { ...movie, sources };
            }
            return;
        }));
        return finalArray.filter(x => x);
    } catch (error) {
        console.error("Error in getAll:", error);
        throw error;
    }
}





//TO BE ORGANIZED
async function getStreams(playlistLink) {
    try {
        var streamsRaw = (await axios.get(playlistLink)).data;
        return parseHLS(streamsRaw)
    } catch(err) {
        return [playlistLink]
    }

}


function parseHLS(hlsData){
    var resolutions = hlsData.match(/(?<=RESOLUTION=).*/g)
    var streams = hlsData.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
    return Object.fromEntries(resolutions.map((x, index) => [x, streams[index]]));
}  

module.exports = {getAll};