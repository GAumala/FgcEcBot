const telegram = require("./telegramClient.js")
const START_CMD = "start";
const HABLA_CMD = "habla";

const JIMMY_BOT = "jimmy";
const GUASO_BOT = "guaso";
const DANIEL_BOT = "daniel";
const JORGE_BOT = "jorge";

const TEXT_TYPE = 0;
const MD_TYPE = 1;
const AUDIO_TYPE = 2;
const PHOTO_TYPE = 3;

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

const MEMBER_ERROR_MSG = "No conozco a ese maricon"

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
        telegram.sendMessage(chat_id, MEMBER_ERROR_MSG)
    else
        switch(getTypeFromArrayMessage(randomMsg)){
            case MD_TYPE:
                sender = getMarkdownName(member)
                telegram.sendMarkdown(chat_id, sender + randomMsg)
                break;
            case AUDIO_TYPE:
                telegram.sendVoice(chat_id, randomMsg)
                break;
            case PHOTO_TYPE:
                telegram.sendPhoto(chat_id, randomMsg)
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

module.exports = {
    TEXT_MSG_TYPE : TEXT_TYPE,
    AUDIO_MSG_TYPE : AUDIO_TYPE,
    PHOTO_MSG_TYPE : PHOTO_TYPE,
    MARKDOWN_MSG_TYPE : MD_TYPE,
    processTextCommand : function(cmd, text, message) {
        let chat_id = message.chat.id;
        switch(cmd){
            case HABLA_CMD:
                replyToCommand(chat_id, text)
                break;
            case START_CMD:
                telegram.sendMessage(chat_id, HELP_MSG);
                break;
        }
    }
};
