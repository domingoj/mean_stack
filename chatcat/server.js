'use strict';
const express = require('express');
const app = express();

//will look for index.js file by default from that folder
const chatCat = require('./app');

app.set('port', process.env.PORT || 3000);

//required only if you want to set the views folder path to another name
//views is default
//app.set('views', './views');

//to serve the static files (css, etc.)
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', chatCat.router);

app.get('/dashboard', (req, res, next) => {
	res.send('<h1>This is the dashboard page! Middelware says ' + req.hello + '</h1>');
});

//handle 404
//for reference on express error handling:
//http://stackoverflow.com/questions/36113101/handling-404-500-and-exceptions-in-node-js-and-express
app.use((req, res, next) => {

	res.status(404).sendFile(process.cwd() + '/views/404.htm');

});

app.listen(app.get('port'), () => console.log('ChatCAT running on port: ', 3000));