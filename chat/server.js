var chatServer = require('./lib/chat_server');
chatServer.listen(server);
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var server = http.createServer(function(request,response){
	var filePath = false;
	if (request.url == '/'){
		filePath = 'public/index.html';
	} else {
		filePath = 'public'+request.url;
	}
	var absPath = './'+filePath;
	serveStatic(response,cache,absPath);
});
server.listen(3000,function(request,response){
	console.log('Berjalan di Port 3000');
});
function send404(response){
	response.writeHead(404,{'Content-Type' : 'text/plain'});
	response.write('Oops Page Your Request is not found');
	response.end();
}

function sendFile(response,filePath,fileContents){
	response.writeHead(200,{'Content-Type': mime.lookup(path.basename(filePath))});
	response.end(fileContents);
}

function serveStatic(response,cache,absPath){
	if (cache[absPath]){
		sendFile(response,absPath,cache[absPath]);
	} else {
		fs.exists(absPath, function(exists){
			if (exists){
				fs.readFile(absPath,function(error,data){
					if (error){
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response,absPath,data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}
