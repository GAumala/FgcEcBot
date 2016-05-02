const credentials = require("./botCredentials.js");
const client = require('request');
const myBot = require("./fgcEcuadorBot.js");
const fs = require('fs');

const TELEGRAM_BASE_URL = "https://api.telegram.org/bot";
const TELEGRAM_API = TELEGRAM_BASE_URL + credentials.BOT_TOKEN + '/';

const GET_UPDATES = "getUpdates";
var updateOffset = 0;

const SEND_MESSAGE = "sendMessage";
const SEND_VOICE = "sendVoice";
const SEND_PHOTO = "sendPhoto";

function processInlineQuery(inlineQuery){
    console.log("inline query: " + inlineQuery.query);
}

function isACommandMessage(text){
    return text.charAt(0) == '/';
}

function sendBotMessage(chat_id, msg){
    switch(msg.type){
        case myBot.TEXT_MSG_TYPE:
            sendMessage(chat_id, msg.content);
            break;
        case myBot.AUDIO_MSG_TYPE:
            sendVoice(chat_id, msg.content);
            break;
        case myBot.PHOTO_MSG_TYPE:
            sendPhoto(chat_id, msg.content);
            break;
        case myBot.MARKDOWN_MSG_TYPE:
            sendMarkdown(chat_id, msg.content);
            break;


    }
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
            let str = message.text.substr(spaceIndex + 1);
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

function sendMarkdown(chat_id, text){
    var args ="?chat_id=" + chat_id + "&text=" + text +
         "&parse_mode=Markdown";
    client(TELEGRAM_API + SEND_MESSAGE + args, function( error, response, data) {
        if(response.body.ok)
            console.log("sent: markdown");
    });

}

function sendVoice(chat_id, filepath){
    var formData = {
        chat_id : chat_id,
        voice : fs.createReadStream(filepath)
    };
    client.post({url: TELEGRAM_API + SEND_VOICE, 
                json : true,
                formData: formData },
                function (error, response, body){
                    if(response.body.ok)
                        console.log("sent: audio");
                });
}

function sendPhoto(chat_id, filepath){
    var formData = {
        chat_id : chat_id,
        photo : fs.createReadStream(filepath)
    };
    client.post({url: TELEGRAM_API + SEND_PHOTO, 
                json : true,
                formData: formData },
                function (error, response, body){
                    if(response.body.ok)
                        console.log("sent: photo");
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



