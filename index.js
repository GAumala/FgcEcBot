require('dotenv').config()
const longPoll = require('tgbots/longpoll');

const fgcBot = require('./fgcEcuadorBot.js')
const twitterStream = require('./twitterStreamer.js')
twitterStream.init(fgcBot)
longPoll.addBot(fgcBot)

longPoll.start()
