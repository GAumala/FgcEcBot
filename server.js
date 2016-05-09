const longPoll = require('tgbots/longpoll');

const fgcBot = require('./fgcEcuadorBot.js')
longPoll.addBot(fgcBot)
const tecoBot = require('./tecogramBot.js')
longPoll.addBot(tecoBot)

longPoll.start()



