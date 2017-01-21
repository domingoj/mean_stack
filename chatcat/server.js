'use strict';
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

let helloMiddleware = (req, res, next) => {
	req.hello = "Hello! Its me...";
	next();
}

//plugs the middleware function in
app.use(helloMiddleware);


//if made like this, middleware will only work on routes origination from /dashboard
// and forward e.g. (/dashboard/password, etc.) 
//app.use('/dashboard', helloMiddleware);

app.get('/', (req, res, next) => {
	res.send('<h1>Hello Express!</h1>');
	console.log(req.hello);
});

app.get('/dashboard', (req, res, next) => {
	res.send('<h1>This is the dashboard page! Middelware says ' + req.hello + '</h1>');

});

app.listen(app.get('port'), () => console.log('ChatCAT running on port: ', 3000));