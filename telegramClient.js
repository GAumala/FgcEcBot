const credentials = require("./botCredentials.js");
const client = require('request');
const fs = require('fs');

const TELEGRAM_BASE_URL = "https://api.telegram.org/bot";
const TELEGRAM_API = TELEGRAM_BASE_URL + credentials.BOT_TOKEN + '/';

const SEND_MESSAGE = "sendMessage";
const SEND_VOICE = "sendVoice";
const SEND_PHOTO = "sendPhoto";

var exports = module.exports =  {
    TELEGRAM_API : TELEGRAM_API
}
exports.sendMessage = function (chat_id, text){
    var args ="?chat_id=" + chat_id + "&text=" + text;
    client(TELEGRAM_API + SEND_MESSAGE + args, function( error, response, data) {
        if(response.body.ok)
            console.log("sent: text");
    });
}

exports.sendMarkdown = function(chat_id, text){
    var args ="?chat_id=" + chat_id + "&text=" + text +
         "&parse_mode=Markdown";
    console.log("send md: " + chat_id + " " + text)
    client(TELEGRAM_API + SEND_MESSAGE + args, function( error, response, data) {
        if(response.body.ok)
            console.log("sent: markdown");
    });

}

exports.sendVoice = function (chat_id, filepath){
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

exports.sendPhoto = function (chat_id, filepath){
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







