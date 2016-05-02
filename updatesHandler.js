const telegram = require("./telegramClient.js")
const myBot = require("./fgcEcuadorBot.js") 
const GET_UPDATES = "getUpdates";
const client = require('request');

var updateOffset = 0;

function processInlineQuery(inlineQuery){
    console.log("inline query: " + inlineQuery.query);
}

function isACommandMessage(text){
    return text.charAt(0) == '/';
}

function extractCommand(string){
    var index = string.indexOf('@')
    string = string.toLowerCase()    
    if( index == -1)
        return string
    else 
        return string.substring(0,index)
}
        
/*
 * This message object is guaranteed to hace a text attribute
 */ 
function processMessageText(message){
    //console.log("message text: " + text);
    if(isACommandMessage(message.text)){
        var spaceIndex = message.text.indexOf(' ');
        var cmd;
        if(spaceIndex != -1) {
            cmd = message.text.substring(1, spaceIndex);
            cmd = extractCommand(cmd)
            let str = message.text.substr(spaceIndex + 1);
            myBot.processTextCommand(cmd, str, message);
        } else {
            cmd = message.text.substr(1)
            cmd = extractCommand(cmd)
            myBot.processTextCommand(cmd, "", message);
        }
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


module.exports = {
    getUpdates : function (){
	//console.log("offset: " + updateOffset);
	client({
            url: telegram.TELEGRAM_API + GET_UPDATES + "?offset=" + updateOffset,
            json: true
        }, function( error, response, data) {
            if(!error && response.statusCode == 200) {
                console.log(response.body);
                if(response.body.ok){
                    let messages = response.body.result;
                    for(let i = 0; i < messages.length; i++){
                        processUpdate(messages[i]);
                    }
                }
            } else {
                console.log(error);
            }
	});
    }
};
