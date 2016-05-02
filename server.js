const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const async = require('async');
const telegram = require('./telegramClient.js');

const options = {
    key: fs.readFileSync('MYPRIVATE.key'),
    cert: fs.readFileSync('MYPUBLIC.pem')
};

// Create a service (the app object is just a callback).
const app = express();

// Create an HTTP service.
http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8192);

app.get("/", function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
});


process.on('SIGINT', function () {
     //handle your on exit code
     console.log("Exiting, have a nice day");
     process.exit();
});

var count = 0;
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
