var fs = require('fs');
var stream = fs.createReadStream('source.json');
stream.on('data',function(chunck){
	console.log(chunck)
});
stream.on('end',function(){
	console.log('finish')
});