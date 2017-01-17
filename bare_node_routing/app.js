'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>Hello Router </h1>');
		},
		'/about': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>This is the about page </h1>');
		},
		'/api/getinfo': (req, res) => {
			// fetch data from db and respond as JSON
			res.writeHead(200, {'Content-type': 'application/json'});
			console.log(req.queryParams);
			res.end(JSON.stringify(req.queryParams));
		}

	},
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', data => {
				body += data;
				console.log(body.length);

				//2 mb
				if(body.length > 2097152) {
					//signal to the browser that the payload is too large
					res.writeHead(413, {'Content-type' : 'text/html'});

					res.end('<h3>Error: The file exceeds the 2 MB limit</h3>',
						//stop the request
						() => req.connection.destroy());
				}
			});

			req.on('end', () => {
				let params = qs.parse(body);
				console.log('Username: ', params['username']);
				console.log('Password: ', params['password']);

				//query users db
				res.end();
			});
		}
	},
	'NA': (req, res) => {
		res.writeHead(404);
		res.end('Content not found!');

	}
}

function router(req, res){

	let baseURI = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseURI.pathname];
	if(resolveRoute != undefined) {
		req.queryParams = baseURI.query;
		resolveRoute(req, res);
	} else {
		routes['NA'](req, res);
	}
	
}

http.createServer(router).listen(3000, () => {
	console.log('Server is running on port 3000');
});