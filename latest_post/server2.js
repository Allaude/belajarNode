var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res){
	getTitle(res);
}).listen(8000,"127.0.0.1");

function getTitle(res){
	fs.readFile('./title.json',function(err,data){
		if (err){
			console.log(err);
			res.end("Server Error");
		} else {
			getTemplate(JSON.parse(data.toString()),res);
		}
	});
}

function getTemplate(title,res){
	fs.readFile('./template.html',function(err,data){
		if (err){
			hadError(err,res);
		} else {
			formatHtml(title,data.toString(),res);
		}
	});
}

function formatHtml(title,tmpl,res){
	var html = tmpl.replace('%',title.join('<li></li>'));
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end(html);
}

function hadError(err,res){
	console.error(err);
	res.end('Server Error');
}