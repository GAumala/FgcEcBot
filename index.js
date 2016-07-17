const longPoll = require('tgbots/longpoll');

const fgcBot = require('./fgcEcuadorBot.js')
const twitterStream = require('./twitterStreamer.js')
twitterStream.init(fgcBot)
longPoll.addBot(fgcBot)
//const tecoBot = require('./tecogramBot.js')
//longPoll.addBot(tecoBot)

longPoll.start()

//Heroku needs to bind ports, so let's do some lame express server
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World! fgcEcBot is Running A-Ok!!');
});

const port = process.env.PORT || 8080
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
