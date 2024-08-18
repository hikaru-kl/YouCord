// ==UserScript==
// @name         Discord`s YouTube activity
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Script that allows get data about video and show it in discord account`s game activity
// @author       hikaru_kl
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://cdn.socket.io/4.7.5/socket.io.min.js
// @run-at document-end
// @connect 127.0.0.1
// @grant GM_xmlhttpRequest
// @grant window.onurlchange
// ==/UserScript==

(function() {
    'use strict';
    let wsfailed = false;
    let socket = new WebSocket("ws://localhost:5750/");
    let player = document.getElementById('movie_player')
    let data;
    console.log(`Discord's activity script has been loaded`);
    setTimeout(() => {
        if (window.location.pathname == '/watch') {
            if (socket.readyState !== 1) {
                console.log("Connection to WebSocket Server could not be made");
                wsfailed = true;
            } else {
                console.log("Connection established!");
                setInterval(() => {
                    try {
                        data = {
                            v: window.location.href,
                            currentTime: player.getCurrentTime(),
                            videoDuration: player.getDuration(),
                            videoTitle: document.querySelector("yt-formatted-string[class='style-scope ytd-watch-metadata']").innerHTML,
                            channel: document.querySelector("a[class='yt-simple-endpoint style-scope yt-formatted-string']").innerHTML
                        }
                    } catch {
                        console.log('Unexcepted error, retrying in 2 seconds...')
                        new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    socket.send(JSON.stringify(data));
                }, 1000)
            }
        }
    }, 6000);
})();