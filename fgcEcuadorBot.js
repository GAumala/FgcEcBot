var HABLA_CMD = "habla";

var JIMMY_BOT = "jimmy";
var GUASO_BOT = "guaso";
var DANIEL_BOT = "daniel";

var TEXT_TYPE = 0;
var AUDIO_TYPE = 1;
var PHOTO_TYPE = 2;

var JIMMY_PHRASES = ["maricon hijueputa, maricon",
                     "te voy a sacar la puta",
                     "por que no te vas a la verga?",
                     "Alguien quiere salsearme?"];
var GUASO_PHRASES = ["BUBU!, vales harta paloma",
                     "Yo soy tu verdugo!",
                     "soniaras conmigo papa, soy tu peor pesadilla.",
                     "Que se lleve todo menos mi play pls"];
var DANIEL_PHRASES = ["Si la ves a belen pls dile que me llame",
                     "Quiero mandarle a belen los tornados de rashid por la papaya.",
                     "aplasto todos los botones!!",
                     "INFILCHOLO!!"];



function createBotMessage(msgType, msgContent) {
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
    return createBotMessage(1, "audio/jorge02.ogg");
    switch(individual) {
        case JIMMY_BOT: {
            return createBotMessage(0, generateRandomMsg(JIMMY_PHRASES));
        }
        case GUASO_BOT: {
            return createBotMessage(0, generateRandomMsg(GUASO_PHRASES));
        }
        case DANIEL_BOT: {
            return createBotMessage(0, generateRandomMsg(DANIEL_PHRASES));
        }
    }
}

module.exports = {
    TEXT_MSG_TYPE : TEXT_TYPE,
    AUDIO_MSG_TYPE : AUDIO_TYPE,
    PHOTO_MSG_TYPE : PHOTO_TYPE,
    processTextCommand : function(cmd, text) {
        if(cmd == HABLA_CMD){
            return getIndividualResponse(text.toLowerCase());
        }
    }
};
