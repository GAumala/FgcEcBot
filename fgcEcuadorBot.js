const chalk = require('chalk')
const telegram = require('tgbots')
const fs  = require('fs')

const twitterSubs = require('./twitterSubs.js')
const START_CMD = "start";
const HABLA_CMD = "habla";
const STOP_CMD = "stop";
const HELP_CMD = "help";
const FOLLOWING_CMD = "following";

const MD_TYPE = 1;
const AUDIO_TYPE = 2;
const PHOTO_TYPE = 3;

const token = process.env.TELEGRAM_SECRET_TOKEN

const MEMBER_ERROR_MSG = "No conozco a ese maricon"

const config = JSON.parse(fs.readFileSync('config.json').toString())

function getTypeFromArrayMessage(str){
    if(str.endsWith(".ogg"))
        return AUDIO_TYPE;
    else if(str.endsWith(".jpg"))
        return PHOTO_TYPE;
    else
        return MD_TYPE;
}

function getMarkdownName(member){
    member = capitalizeFirstLetter(member)
    return "*" + member + "*: "
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function replyToCommand(chat_id, member){
    const randomMsg = generateRandomMsg(member)
    if(!randomMsg)
        telegram.sendMessage(chat_id, MEMBER_ERROR_MSG, token)
    else
        switch(getTypeFromArrayMessage(randomMsg)){
        case MD_TYPE:
            let sender = getMarkdownName(member)
            telegram.sendMarkdown(chat_id, sender + randomMsg, token)
            break;
        case AUDIO_TYPE:
            telegram.sendVoice(chat_id, randomMsg, token)
            break;
        case PHOTO_TYPE:
            telegram.sendPhoto(chat_id, randomMsg, token)
            break;
        }
}

function generateRandomMsg(member) {
    let array = config.phrases[member.toLowerCase()]
    if(array){
        let rand = Math.floor(Math.random() * array.length);
        return array[rand];
    }
}

function broadcastNewTweet(tweet) {
    if(tweet.in_reply_to_status_id_str || tweet.in_reply_to_user_id_str || tweet.retweeted_status)
        return //no replies!

    console.log("NEW TWEET!: " + JSON.stringify(tweet));
    const baseTwitterURL = "https://twitter.com/" + tweet.user.screen_name + "/status/"
    twitterSubs.list().forEach(function (conversation){
        telegram.sendMessage(conversation, baseTwitterURL + tweet.id_str, token);
    //telegram.sendMessage(conversation, tweet.text, token);
    })
}

function getFollowingsMessage() {
    let msg = "Puedo envíar en tiempo real tweets de estas cuentas:\n"
    config.following.forEach(function (user){
        msg += user + '\n'
    });
    return msg
}

module.exports = {
    processTextCommand : function(cmd, text, message) {
        let chat_id = message.chat.id;
        switch(cmd){
        case HABLA_CMD:
            replyToCommand(chat_id, text)
            break;
        case HELP_CMD:
            telegram.sendMessage(chat_id, config.helpMsg, token);
            break;
        case START_CMD:
            if(twitterSubs.push(chat_id))
                telegram.sendMessage(chat_id, config.subscribedMsg, token);
            else
                  telegram.sendMessage(chat_id, config.alreadySubbedMsg, token);
            break;
        case STOP_CMD:
            if(twitterSubs.remove(chat_id))
                telegram.sendMessage(chat_id, config.unsubscribedMsg, token);
            else
                  telegram.sendMessage(chat_id, config.notSubbedMsg, token);
            break;
        case FOLLOWING_CMD:
            telegram.sendMessage(chat_id, getFollowingsMessage(), token)
        }
    },
    updateOffset : 0,
    getToken : function () {
        return token
    },
    processTextMessage : function (message) {
        console.log("fgc txt msg: " + message.text)
    },

    setTwitterStream : function(stream){
        stream.on('data', broadcastNewTweet)

        stream.on('error', function(error) {
            console.log(chalk.red(error))
        });
    },

    usersToFollow: config.following,
};
