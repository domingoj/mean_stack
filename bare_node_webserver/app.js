'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.png': 'image/png'
}

function fileAccess(filepath) {
	return new Promise((resolve, reject) => {
		fs.access(filepath, fs.F_OK, error => {
			if(!error){
				resolve(filepath);
			} else {
				reject(error);
			}
		})
	});
}

function streamFile(filepath) {
	return new Promise((resolve, reject) => {
		let fileStream = fs.createReadStream(filepath);

		fileStream.on('open', () => {
			resolve(fileStream);
		});

		fileStream.on('error', error => {
			reject(error);
		});
	});
}

function webserver(req, res) {
	// if the route requested is '/', then load 'index.htm' or else
	// load the requested file(s)

	let baseURI = url.parse(req.url);
	let filepath = __dirname + '/public' + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
	let contentType = mimes[path.extname(filepath)]; // mimes['.css'] === 'text/css'
	
	fileAccess(filepath)
		//invoked when fileAccesspromise is resolved
		.then(streamFile)
		//invoked when fileReader promise is resolved
		.then(fileStream => {
			res.writeHead(200, {'Content-type': contentType});
			//not required since stream is a continuous flow of data
			//res.end(content, 'utf-8');
			fileStream.pipe(res);
		})
		.catch(error => {
			res.writeHead(404);
			res.end(JSON.stringify(error));
		});
	

}

http.createServer(webserver).listen(3000, () => console.log('Webserver running on port 3000!'));