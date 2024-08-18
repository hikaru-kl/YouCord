const rpc = require("discord-rpc");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5750 });

const discord_client = new rpc.Client({ transport: "ipc" });
discord_client.login({ clientId: "1273883076702900224" }).catch(console.error);

const pad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

const convertTimeYTformat = (timeSec) => {
    const seconds = pad(Math.floor(timeSec % 60), 2)
    let hours
    let minutes
    if (Math.floor(timeSec / 60) > 60) {
        hours = Math.floor(timeSec / 3600)
        minutes = pad(Math.floor(timeSec / 60 % 60), 2)
    } else {
        minutes = Math.floor(timeSec / 60)
    }
    return hours ? `${hours}:${minutes}:${seconds}`  : `${minutes}:${seconds}` 
}

console.log('Listning connections on 127.0.0.1:5750');
wss.on("connection", function connection(ws) {
    console.log(`Connected`);  
    ws.on("message", function incoming(e) {
        let data = JSON.parse(e);
        console.log('Send activity to Discord');  
        discord_client.request("SET_ACTIVITY", {
            pid: process.pid,
            activity: {
                type: 3,
                details: `Watching YouTube ${data.videoDuration == '0' ? 'stream' : 'video'}`,
                state: convertTimeYTformat(data.currentTime) + '/' + convertTimeYTformat(data.videoDuration),
                assets: {
                  large_image: "youtube-icon",
                  large_text:  data.videoTitle.length > 128 ? data.videoTitle.substring(0, 125) + '...' : data.videoTitle,
                  small_image: "user",
                  small_text: data.channel
                },
                buttons: [
                    { label: "Open YouTube video", url: data.v },
                    { label: "Author`s github", url: "https://github.com/hikaru-kl" },
                ],
            },
          })
    });
});