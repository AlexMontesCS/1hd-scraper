
const cheerio = require("cheerio");
const { decodeHunter } = require('./hunter');

const BLACKLISTED = ['VidSrc Hydrax', '2Embed'];

async function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

async function GETStreamServer(name, server, base) {
  const VIDSRC_SERVER_URL = `https://rcp.vidsrc.me/rcp/${server}`;
  const VIDSRC_SERVER_RESP = await fetch(VIDSRC_SERVER_URL, {
    headers: { Referer: base }
  });

  const $ = cheerio.load(await VIDSRC_SERVER_RESP.text());
  const encodedStreamServer = $("div#hidden").attr('data-h');
  const subtitleSeed = $("body").attr("data-i");

  let decodedStreamServer = '';
  const encodedStreamServerBuffer = await hexToBytes(encodedStreamServer);
  for (let i = 0; i < encodedStreamServerBuffer.length; i++) {
    decodedStreamServer += String.fromCharCode(encodedStreamServerBuffer[i] ^ subtitleSeed.charCodeAt(i % subtitleSeed.length));
  }
  decodedStreamServer = decodedStreamServer.startsWith('//') ? 'https:' + decodedStreamServer : decodedStreamServer;

  const SERVER_API_RESP = await fetch(decodedStreamServer, {
    redirect: 'manual',
    headers: { Referer: VIDSRC_SERVER_URL }
  });

  const SERVERIdentifier = SERVER_API_RESP.headers.get('location');
  return { name: name, url: SERVERIdentifier, referer: VIDSRC_SERVER_URL };
}

async function handleVidsrc(url, referer) {
  const MAX_TRIES = 5;
  try {
    const VIDSRC_PRO_BASE = await fetch(url, {
      headers: { Referer: referer }
    });
    const responseText = await VIDSRC_PRO_BASE.text();
    const regex = /file:"([^"]*)"/;
    const match = regex.exec(responseText);
    if (match) {
      let hlsUrl = match[1].replace(/\/\/\S+?=/g, '').substring(2);
      for (let i = 0; i < MAX_TRIES; i++) {
        hlsUrl = hlsUrl.replace(/\/@#@\/[^=\/]+==/, "");
        if (!hlsUrl.match(/\/@#@\/[^=\/]+==/)) break;
      }

      hlsUrl = hlsUrl.replace(/_/g, '/').replace(/-/g, '+');
      const decodedUrl = atob(hlsUrl);
      return { Hls: decodedUrl, Subtitle: null };
    } else {
      return { Hls: null, Subtitle: null };
    }
  } catch (error) {
    console.log(error);
    return { Hls: null, Subtitle: null };
  }
}

async function handleSuperEmbed(url, referer) {
  try {
    const SUPER_EMB_BASE = await fetch(url, {
      headers: {
        Referer: referer,
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      }
    });
    const responseText = await SUPER_EMB_BASE.text();

    const regex = /eval\(function\(h,u,n,t,e,r\).*?\("(.*?)",\d*?,"(.*?)",(\d*?),(\d*?),\d*?\)\)/;
    const linkRegex = /file:"(.*?)"/;
    const match = responseText.match(regex);

    if (match) {
      const encoded = match[1];
      const mask = match[2];
      const charCodeOffset = Number(match[3]);
      const delimiterOffset = Number(match[4]);

      const decoded = await decodeHunter(encoded, mask, charCodeOffset, delimiterOffset);
      const hlsUrl = decoded.match(linkRegex)[1];

      const subtitles = [];
      const subtitleMatch = decoded.match(/subtitle:\"([^\"]*)\"/);
      if (subtitleMatch) {
        const subtitlesList = subtitleMatch[1].split(",");
        for (const subtitle of subtitlesList) {
          const subtitleData = subtitle.match(/^\[(.*?)\](.*$)/);
          if (!subtitleData) continue;
          const lang = subtitleData[1];
          const file = subtitleData[2];
          subtitles.push({ lang, file });
        }
      }
      return { Hls: hlsUrl, Subtitle: subtitles };
    } else {
      return { Hls: null, Subtitle: null };
    }
  } catch (error) {
    console.log(error);
    return { Hls: null, Subtitle: null };
  }
}

async function GETStreams(name, url, referer) {
  const data = url.includes('vidsrc.stream') ? await handleVidsrc(url, referer) : (url.includes('multiembed.mov') && await handleSuperEmbed(url, referer));
  return { name: name, Data: data };
}

// module.exports = {
async function getStuff(request, env, ctx) {
    console.log(request.url)
    const url = new URL(request.url);
    if (url.pathname === '/source') {
      const id = 'tt4574334';
      const param = { s: 1, e: 1 };
      const provider = id.includes("tt") ? "imdb" : "tmdb";
      const type = param.e !== 0 && param.s !== 0 ? "tv" : "movie";
      const SERVERS = { id: id, list: [] };

      const VIDSRC_API_URL = `https://vidsrc.me/embed/${id}` + (type === 'tv' ? `/${param.s}-${param.e}` : '');
      console.log(VIDSRC_API_URL)
      const VIDSRC_API_RESP = await fetch(VIDSRC_API_URL, {
        headers: {
          'Referer': VIDSRC_API_URL,
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'TE': 'trailers',
          'Connection': 'keep-alive'
        }
      });
      const $ = cheerio.load(await VIDSRC_API_RESP.text());
      const serverDivs = $('div.server');
      serverDivs.each((index, element) => {
        if (BLACKLISTED.includes($(element).text())) return;
        else SERVERS.list.push({ name: $(element).text(), hash: $(element).attr("data-hash") });
      });

      const promises = SERVERS.list.map((server) => GETStreamServer(server.name, server.hash, VIDSRC_API_URL));
      const STREAMING_SERVERS = await Promise.all(promises)
        .then(results => {
          return results;
        })
        .catch(error => {
          console.log(error);
          return [];
        });

      const STREAMING_HLS = await Promise.all(STREAMING_SERVERS.map((streaming_server) => GETStreams(streaming_server.name, streaming_server.url, streaming_server.referer)))
        .then(results => {
          return results;
        })
        .catch(error => {
          console.log(error);
          return [];
        });
        
      return new Response(JSON.stringify(STREAMING_HLS), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response('Hello World!');
  }
// };

getStuff({url: "https://vidsrc.net/source"}).then(console.log)