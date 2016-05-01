
var START_CMD = "start";
var HABLA_CMD = "habla";

var JIMMY_BOT = "jimmy";
var GUASO_BOT = "guaso";
var DANIEL_BOT = "daniel";
var JORGE_BOT = "jorge";

var TEXT_TYPE = 0;
var MD_TYPE = 1;
var AUDIO_TYPE = 2;
var PHOTO_TYPE = 3;

var JIMMY_PHRASES = ["maricon hijueputa, maricon",
                     "te voy a sacar la puta",
                     "audio/jimmy01.ogg",
                     "audio/jimmy02.ogg",
                     "photo/jimmy01.jpg",
                     "photo/jimmy02.jpg",
                     "por que no te vas a la verga?",
                     "Alguien quiere salsearme?"];
var GUASO_PHRASES = ["BUBU!, vales harta paloma",
                     "audio/guaso01.ogg",
                     "audio/guaso02.ogg",
                     "audio/guaso03.ogg",
                     "photo/guaso01.jpg",
                     "photo/guaso02.jpg",
                     "Yo soy tu verdugo!",
                     "soniaras conmigo papa, soy tu peor pesadilla.",
                     "Que se lleve todo menos mi play pls"];
var DANIEL_PHRASES = ["Si la ves a belen pls dile que me llame",
                     "Quiero mandarle a belen los tornados de rashid por la papaya.",
                     "aplasto todos los botones!!",
                     "INFILCHOLO!!"];
var JORGE_PHRASES = ["ROSARIOOOO!",
                     "OSCAAAAR!",
                     "waso campeon!",
                     "audio/jorge01.ogg",
                     "audio/jorge02.ogg"];



function getTypeFromArrayMessage(str){
    if(str.endsWith(".ogg"))
        return AUDIO_TYPE;
    else if(str.endsWith(".jpg"))
        return PHOTO_TYPE;
    else
        return MD_TYPE;
}

function createTextMessage(msgContent) {
    var resp = {
        type : TEXT_TYPE,
        content : msgContent
    };
    return resp;
}

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

function createBotMessage(sender, msgContent) {
    var msgType = getTypeFromArrayMessage(msgContent);
    if(msgType == MD_TYPE){
        sender = capitalizeFirstLetter(sender);
        msgContent = "*" + sender + "*: " + msgContent;
        console.log("msgContent: " + msgContent);
    }
    var resp = {
        type : msgType,
        content : msgContent
    };
    return resp;
}

function generateRandomMsg(array) {
    var rand = Math.floor(Math.random() * array.length);
    return array[rand];

}

function getIndividualResponse(individual) {
    switch(individual) {
        case JIMMY_BOT: {
            return createBotMessage(JIMMY_BOT, generateRandomMsg(JIMMY_PHRASES));
        }
        case GUASO_BOT: {
            return createBotMessage(GUASO_BOT, generateRandomMsg(GUASO_PHRASES));
        }
        case DANIEL_BOT: {
            return createBotMessage(DANIEL_BOT, generateRandomMsg(DANIEL_PHRASES));
        }
        case JORGE_BOT: {
            return createBotMessage(JORGE_BOT, generateRandomMsg(JORGE_PHRASES));
        }
    }

    return createTextMessage("No conozco a ese maricon");
}

module.exports = {
    TEXT_MSG_TYPE : TEXT_TYPE,
    AUDIO_MSG_TYPE : AUDIO_TYPE,
    PHOTO_MSG_TYPE : PHOTO_TYPE,
    MARKDOWN_MSG_TYPE : MD_TYPE,
    processTextCommand : function(cmd, text) {
        switch(cmd){
            case HABLA_CMD:
            return getIndividualResponse(text.toLowerCase());
            case START_CMD:
            return createTextMessage("usa el comando /habla con el nombre del fraud que quieres que te hable.\n" +
                    "Estan Jimmy, Jorge, Guaso y Daniel");
        }
    }
};
