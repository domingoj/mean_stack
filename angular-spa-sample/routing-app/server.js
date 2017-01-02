//get the things we need
var express = require('express');
var app = express();
var path = require('path');

// set the public folder to serve public assets
app.use(express.static(__dirname + './public'));

// set up our one route to the index.html file
//http://stackoverflow.com/questions/28894544/uncaught-syntaxerror-unexpected-token-angular-1-2-13-min-js1
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname, {'index': ['/public/views/index.html']}))

// set up our one route to the index.html file
//http://stackoverflow.com/questions/14700099/node-js-angular-js-cannot-get
    app.get('*', function (req, res){
    res.sendFile(path.join(__dirname+'/public/views/index.html'));
});

// start the server on port 8080 (http://localhost:8080)
app.listen(8080);
console.log('Magic happens on port 8080.');