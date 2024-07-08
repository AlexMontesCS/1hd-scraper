const axios = require("axios");
var playlist = "https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/playlist.m3u8"

getStreams(playlist)

async function getStreams(playlistLink) {
    var streamsRaw = (await axios.get(playlist)).data;
    return parseHLS(streamsRaw)
}


function parseHLS(hlsData){
    var resolutions = hlsData.match(/(?<=RESOLUTION=).*/g)
    var streams = hlsData.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
    return Object.fromEntries(resolutions.map((x, index) => [x, streams[index]]));
}  


/*

#EXTM3U
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4500000,RESOLUTION=1920x1080
https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/1080/index.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1800000,RESOLUTION=1280x720
https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/720/index.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=720000,RESOLUTION=640x360
https://ab.bigtimedelivery.net/_v13/4f0019865c56b6606d1369d845d80e955a54484dd2191914b5a96ac5cc0a444cd8453420405aa1f50507fac7e6d85b45516641a12286d2b0ec38437ece9f34293a63d72e7f95ede244d7f53319c525b8e4aa246fcfd1a149dee38e0946eeec977a908ff25e14186dbf1b58a176a02073f5874d44f2847fb730e5e0edabb4990c31d236a028c5c8a55201bd307c619dc7/360/index.m3u8
*/