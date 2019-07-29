var express = require('express');
var bodyParser=require('body-parser');

var app =express();
app.use(bodyParser.json());

var fs = require('fs')


var exec  = require('child_process').exec;



app.get('/get',function(req,res){
res.send("Get request just for testing this endpoint")
});


app.post('/clean',function(req,res){
	console.log("This is  a post request for cleaning");
	var alertArray=req.body.alerts;
	var len=alertArray.length;
        var ip=[];
	for(i=0;i<len;i++)
	{
	console.log(req.body.alerts[i].labels.instance);
        ip.push(req.body.alerts[i].labels.instance);
	//res.send(req.body.alerts[i].labels);
	}
	//console.log(ip);
	var file=fs.createWriteStream('inventory');
	file.write('[QAD]\n');
	ip.forEach(function(item){
		item=item.replace(":9100","");
		file.write(item+"\n");
	});
	file.end();



	exec('ansible-playbook -i inventory rpm_cleanup.yml', (err, stdout, stderr) => {
  		if (err) {
    			//some err occurred
    			console.error(err);
  			 } 
		console.log(stdout);
		});
});
app.listen(2605);

