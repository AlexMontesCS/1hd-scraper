const axios = require("axios")
const cheerio = require("cheerio")
/**
 * Fetches the name of a movie from IMDb by its unique ID.
 * @param {string} id - The IMDb ID of the movie.
 * @returns {Promise<string>} A promise that resolves to the name of the movie.
 */
async function getNameFromImdb(id) {
    id = id.split(":")[0]
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


module.exports = {getNameFromImdb};