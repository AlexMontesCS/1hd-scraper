const axios = require("axios");
const cheerio = require("cheerio");
const decode  = require("./decoder/decode.js")
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
/**
 * Fetch and parse movie details from the search results page.
 * @param {string} movieTitle - The movie title to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of movie objects.
 */
async function scrapeId(movieTitle) {
    const url = `${BASE_URL}/search?keyword=${encodeURIComponent(movieTitle)}`;
    const $ = await fetchHTML(url);
    const detailPromises = $('.item-film a').map(async (_, element) => {
        return fetchMovieDetails($(element));
    }).get();

    return Promise.all(detailPromises).then(results => results.filter(Boolean));
}

/**
 * Fetch movie details for each movie element including handling redirects to capture the server ID.
 * @param {CheerioElement} element - A cheerio element representing the movie link.
 * @returns {Promise<Object|null>} - A promise that resolves to a movie object with detailed information or null if an error occurs.
 */
async function fetchMovieDetails(element) {
    const parent = element.closest('.item-film');
    const spans = parent.find('.film-info span');
    const type = spans.eq(0).text().split(" ").pop() === "Movie" ? 'movie' : 'series';
    const year = spans.eq(1).text();
    const filmLink = `${BASE_URL}${element.attr('href').replace("/movie/", "/watch-movie/")}`;
    const filmTitle = element.attr('title');

    try {
        // Fetch the HTML of the movie details page, handling redirects
        const response = await axios.get(filmLink, {
            maxRedirects: 5,  // Allow up to 5 redirects
            validateStatus: status => status >= 200 && status < 300 // Accept only HTTP success status
        });

        // After all redirects, extract the final URL
        const finalUrl = response.request.res.responseUrl;
        // Extract serverId from the final URL path
        const serverId = finalUrl.split('/').pop();

        // Proceed with fetching the Rabbit ID if necessary
        const rabbitId = await getRabbbitId(serverId);

        return { link: finalUrl, name: filmTitle, serverId, rabbitId, type, year };
    } catch (error) {
        console.error("Error fetching film details:", error);
        return null; // Return null to signify failure in fetching or processing the details
    }
}

/**
 * Retrieve a unique streaming identifier from a movie's server ID.
 * @param {string} serverId - The server ID.
 * @returns {Promise<string>} - A promise that resolves to the Rabbit ID.
 */
async function getRabbbitId(serverId) {
    const url = `${BASE_URL}/ajax/movie/episode/servers/${serverId}`;
    const $ = await fetchHTML(url);
    if($){
        const rabbitRetrieveCode = $('a').first().attr('data-id');
        const rabbitIdResponse = await axios.get(`${BASE_URL}/ajax/movie/episode/server/sources/${rabbitRetrieveCode}`);
        return rabbitIdResponse.data.data.link.split("/").pop().split("?")[0];
    }
}

/**
 * Fetch video and caption sources for a movie based on its Rabbit ID.
 * @param {string} rabbitId - The Rabbit ID.
 * @returns {Promise<Object>} - A promise that resolves to an object containing video and caption sources.
 */
async function getSources(rabbitId) {
    var results = await decode(rabbitId);
    return results;
}

/**
 * Fetch all available details for movies matching a given name.
 * @param {string} movieName - The name of the movie.
 * @returns {Promise<Array>} - A promise that resolves to an array of detailed movie objects.
 */
async function getAll(movieName) {
    try {
        const movies = await scrapeId(movieName);
        const finalArray = await Promise.all(movies.map(async movie => {
            if (movie.rabbitId) {
                const sources = await getSources(movie.rabbitId);
                return { ...movie, sources };
            }
            return movie;
        }));
        return finalArray;
    } catch (error) {
        console.error("Error in getAll:", error);
        throw error;
    }
}


/**
 * Fetches the name of a movie from IMDb by its unique ID.
 * @param {string} id - The IMDb ID of the movie.
 * @returns {Promise<string>} A promise that resolves to the name of the movie.
 */
async function getNameFromImdb(id) {
    const url = `https://www.imdb.com/title/${encodeURIComponent(id)}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36'
    };

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const movieName = $('.hero__primary-text').first().text().trim();
        return movieName; // Returns the extracted movie name
    } catch (error) {
        console.error("Failed to fetch movie name from IMDb:", error);
        throw new Error(`Failed to fetch movie name from IMDb for ID ${id}`); // Throws error to be handled by caller
    }
}

module.exports = {getAll, getNameFromImdb};