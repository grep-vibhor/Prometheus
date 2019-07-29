var express = require('express');
var bodyParser=require('body-parser');
var app =express();
app.use(bodyParser.json());

app.get('/get',function(req,res)
	{
		console.log("This is a get request");
		res.send("output");
	}
)
app.post('/test',function(req,res){
	console.log(req.query);
});
app.listen(5000);
