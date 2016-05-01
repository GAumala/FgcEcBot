
var START_CMD = "start";
var HABLA_CMD = "habla";

var JIMMY_BOT = "jimmy";
var GUASO_BOT = "guaso";
var DANIEL_BOT = "daniel";
var JORGE_BOT = "jorge";

var TEXT_TYPE = 0;
var AUDIO_TYPE = 1;
var PHOTO_TYPE = 2;

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



function getTypeFromMessage(str){
    if(str.endsWith(".ogg"))
        return AUDIO_TYPE;
    else if(str.endsWith(".jpg"))
        return PHOTO_TYPE;
    else
        return TEXT_TYPE;
}

function createBotMessage(msgContent) {
    var msgType = getTypeFromMessage(msgContent);
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
            return createBotMessage(generateRandomMsg(JIMMY_PHRASES));
        }
        case GUASO_BOT: {
            return createBotMessage(generateRandomMsg(GUASO_PHRASES));
        }
        case DANIEL_BOT: {
            return createBotMessage(generateRandomMsg(DANIEL_PHRASES));
        }
        case JORGE_BOT: {
            return createBotMessage(generateRandomMsg(JORGE_PHRASES));
        }
    }

    return createBotMessage("No conozco a ese maricon");
}

module.exports = {
    TEXT_MSG_TYPE : TEXT_TYPE,
    AUDIO_MSG_TYPE : AUDIO_TYPE,
    PHOTO_MSG_TYPE : PHOTO_TYPE,
    processTextCommand : function(cmd, text) {
        switch(cmd){
            case HABLA_CMD:
            return getIndividualResponse(text.toLowerCase());
            case START_CMD:
            return createBotMessage("usa el comando /habla con el nombre del fraud que quieres que te hable.\n" +
                    "Estan Jimmy, Jorge, Guaso y Daniel");
        }
    }
};
