var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/',function (res,res){
	res.send('TODO API root');
});

app.listen(PORT, function (){
	console.log('TODO API web server is started on ' + PORT);
});

