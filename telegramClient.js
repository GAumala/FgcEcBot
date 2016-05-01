var credentials = require("./botCredentials.js");
var client = require('request');
var myBot = require("./fgcEcuadorBot.js");

var TELEGRAM_BASE_URL = "https://api.telegram.org/bot";
var TELEGRAM_API = TELEGRAM_BASE_URL + credentials.BOT_TOKEN + '/';

var GET_UPDATES = "getUpdates";
var updateOffset = 0;

var SEND_MESSAGE = "sendMessage";

function processInlineQuery(inlineQuery){
    //console.log("inline query: " + inlineQuery.query);
}

function isACommandMessage(text){
    return text.charAt(0) == '/';
}

function sendBotMessage(chat_id, msg){
    console.log("response created");
    if(msg.type == myBot.TEXT_MSG_TYPE)
        sendMessage(chat_id, msg.content);
}

/*
 * This message object is guaranteed to hace a text attribute
 */ 
function processMessageText(message){
    //console.log("message text: " + text);
    if(isACommandMessage(message.text)){
        var spaceIndex = message.text.indexOf(' ');
        var reply;
        var cmd;
        if(spaceIndex != -1) {
            cmd = message.text.substring(1, spaceIndex);
            var str = message.text.substr(spaceIndex + 1);
            reply = myBot.processTextCommand(cmd.toLowerCase(), str);
        } else {
            cmd = message.text.substr(1).toLowerCase();
            reply = myBot.processTextCommand(cmd, "");
        }
        if(reply)
            sendBotMessage(message.chat.id, reply);
    }
}

function processMessage(message){
    //console.log("message: " + message);
    if(message.text)
	processMessageText(message);
}

function processUpdate(update) {
    updateOffset = update.update_id + 1;
    if(update.inline_query)
	processInlineQuery(update.inline_query);
    if(update.message)
        processMessage(update.message);
}

function sendMessage(chat_id, text){
    var args ="?chat_id=" + chat_id + "&text=" + text;
    client(TELEGRAM_API + SEND_MESSAGE + args, function( error, response, data) {
        if(response.body.ok)
            console.log("sent: text");
    });

}

module.exports = {
    getUpdates : function (){
	//console.log("offset: " + updateOffset);
	client({
            url: TELEGRAM_API + GET_UPDATES + "?offset=" + updateOffset,
            json: true
        }, function( error, response, data) {
            if(!error && response.statusCode == 200) {
                console.log(response.body);
                if(response.body.ok){
                    var messages = response.body.result;
                    var i;
                    for(i = 0; i < messages.length; i++){
                        processUpdate(messages[i]);
                    }
                }
            }
	});
    }
};



