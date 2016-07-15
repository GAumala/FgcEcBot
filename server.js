const longPoll = require('tgbots/longpoll');

const fgcBot = require('./fgcEcuadorBot.js')
const twitterStream = require('./twitterStreamer.js')
twitterStream.setBot(fgcBot)
longPoll.addBot(fgcBot)
//const tecoBot = require('./tecogramBot.js')
//longPoll.addBot(tecoBot)

longPoll.start()
