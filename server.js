var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var async = require('async');
var telegram = require('./telegramClient.js');

var options = {
    key: fs.readFileSync('MYPRIVATE.key'),
    cert: fs.readFileSync('MYPUBLIC.pem')
};

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8192);

app.get("/", function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});

count = 0;
async.whilst(
    function () { return true; },
    function (callback) {
	telegram.getUpdates();
	count++;
        setTimeout(function () {
            callback(null, count);
        }, 2000);
    },
    function (err, n) {
	console.log("long polling over");
    }
);
