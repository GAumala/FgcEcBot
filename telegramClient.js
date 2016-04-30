var credentials = require("./botCredentials.js");
var Client = require('node-rest-client').Client;
var client = new Client();

var TELEGRAM_BASE_URL = "https://api.telegram.org/bot";
var TELEGRAM_API = TELEGRAM_BASE_URL + credentials.BOT_TOKEN + '/';
var GET_UPDATES = "getUpdates";
var updateOffset = 0;

module.exports = {
    getUpdates : function (){
	console.log("offset: " + updateOffset);
	client.get(TELEGRAM_API + GET_UPDATES + "?offset=" + updateOffset, function( data, response) {
	    console.log(data);
	    if(data.ok){
	        var messages = data.result;
		if (messages.length > 0)
	            updateOffset = messages[messages.length - 1].update_id + 1;
	    }
	});
    }
};

