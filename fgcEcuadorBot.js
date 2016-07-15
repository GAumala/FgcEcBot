const chalk = require('chalk')
const telegram = require("tgbots")
const credentials = require("./credentials.js")
const START_CMD = "start";
const HABLA_CMD = "habla";
const STOP_CMD = "stop";
const HELP_CMD = "help";

const JIMMY_BOT = "jimmy";
const GUASO_BOT = "guaso";
const DANIEL_BOT = "daniel";
const JORGE_BOT = "jorge";

//const TEXT_TYPE = 0;
const MD_TYPE = 1;
const AUDIO_TYPE = 2;
const PHOTO_TYPE = 3;

var token = credentials.getToken()

const JIMMY_PHRASES = ["maricon hijueputa, maricon",
                     "te voy a sacar la puta",
                     "audio/jimmy01.ogg",
                     "audio/jimmy02.ogg",
                     "photo/jimmy01.jpg",
                     "photo/jimmy02.jpg",
                     "por que no te vas a la verga?",
                     "Alguien quiere salsearme?"];
const GUASO_PHRASES = ["BUBU!, vales harta paloma",
                     "audio/guaso01.ogg",
                     "audio/guaso02.ogg",
                     "audio/guaso03.ogg",
                     "photo/guaso01.jpg",
                     "photo/guaso02.jpg",
                     "photo/guaso03.jpg",
                     "photo/guaso04.jpg",
                     "photo/guaso05.jpg",
                     "photo/guaso06.jpg",
                     "Yo soy tu verdugo!",
                     "soniaras conmigo papa, soy tu peor pesadilla.",
                     "Que se lleve todo menos mi play pls"];
const DANIEL_PHRASES = ["Si la ves a belen pls dile que me llame",
                     "Quiero mandarle a belen los tornados de rashid por la papaya.",
                     "aplasto todos los botones!!",
                     "INFILCHOLO!!"];
const JORGE_PHRASES = ["ROSARIOOOO!",
                     "OSCAAAAR!",
                     "waso campeon!",
                     "audio/jorge01.ogg",
                     "audio/jorge02.ogg"];

const HELP_MSG = "usa el comando /habla con el nombre del fraud que quieres que te hable.\n" +
                    "Estan Jimmy, Jorge, Guaso y Daniel"

const SUBSCRIBED_MSG = "Desde ahora, voy a enviarles updates del EVO"
const UNSUBSCRIBED_MSG = "Ya no les voy a envíar más updates del EVO"
const ALREADY_SUBBED_MSG = "Ya estás en mi lista."
const NOT_SUBBED_MSG = "No estás en mi lista."
const MEMBER_ERROR_MSG = "No conozco a ese maricon"

const twitterSubs = []

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
    var randomMsg = generateRandomMsg(member)
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
    var array;
    switch(member.toLowerCase()){
        case JIMMY_BOT:
            array = JIMMY_PHRASES
            break;
        case GUASO_BOT:
            array = GUASO_PHRASES
            break;
        case DANIEL_BOT:
            array = DANIEL_PHRASES
            break;
        case JORGE_BOT:
            array = JORGE_PHRASES
            break;
    }

    if(array){
        let rand = Math.floor(Math.random() * array.length);
        return array[rand];
    }

}

function broadcastNewTweet(tweet) {
  console.log("NEW TWEET!: " + JSON.stringify(tweet));
  const baseTwitterURL = "https://twitter.com/" + tweet.user.screen_name + "/status/"
  twitterSubs.forEach(function (conversation){
    telegram.sendMessage(conversation, baseTwitterURL + tweet.id_str, token);
  })
}

module.exports = {
    processTextCommand : function(cmd, text, message) {
        let chat_id = message.chat.id;
        switch(cmd){
            case HABLA_CMD:
                replyToCommand(chat_id, text)
                break;
            case START_CMD:
                if(!twitterSubs.includes(chat_id)){
                  twitterSubs.push(chat_id)
                  telegram.sendMessage(chat_id, SUBSCRIBED_MSG, token);
                } else
                  telegram.sendMessage(chat_id, ALREADY_SUBBED_MSG, token);
                break;
            case STOP_CMD:
                const unsubbedChatIndex = twitterSubs.indexOf(chat_id)
                if(unsubbedChatIndex > -1){
                  twitterSubs.splice(unsubbedChatIndex, 1)
                  telegram.sendMessage(chat_id, UNSUBSCRIBED_MSG, token);
                } else
                  telegram.sendMessage(chat_id, NOT_SUBBED_MSG, token);
                break;
        }
    },
    updateOffset : 0,
    getToken : function () {
        return token
    },
    processTextMessage : function (message) {
        console.log("fgc txt msg: " + message.text)
    },

    onNewTweet : function(stream){
      stream.on('data', broadcastNewTweet)

      stream.on('error', function(error) {
        console.log(chalk.red(error))
      });
    }
};
