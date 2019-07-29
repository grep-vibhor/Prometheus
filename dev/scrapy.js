const cheerio = require('cheerio');
const request = require('request');
const cheerioTableparser = require('cheerio-tableparser');
const conif = require('node-console-input');

/*
console.log("Enter A Component from following list::\n");
console.log("[alerts,configtool,dc,dcservlets,dapgatherer,dag,newsdk,payitallpaymon,paymentengine,restserver,ubd,ycc,ytask,ysl,messagingservice,moneycenter,ngyccservices,appscenter,nodefinapp,oauthclient,wealthngyccservices]");

var component = conif.getConsoleInput("Enter a Component: ", false);
console.log(component+"\n");
*/

var express = require('express');


var app =express();

const mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "192.168.113.58",
  user: "test",
  password: "12345678",
  database: "builds",
  multipleStatements: true  
});

app.post('/update',function(req,res){
component = req.query.component;
SQL_Query="DELETE FROM " +component+"_builds;INSERT INTO "+component+ "_builds(Build_Name) VALUES ?";
console.log(SQL_Query);

var uri='https://sdp-qa-nexus.corp.yodlee.com:1443/nexus/content/repositories/yodlee/' + component ;





request({
    rejectUnauthorized: false,
    method: 'GET',
    url: uri,
}, (err, res, body) => {

    if (err) return console.error(err);

    let $ = cheerio.load(body);
    cheerioTableparser($);
    let data= $("table").parsetable(true,true,true);
    buildArr=data[0]
    buildArr.shift();
    buildArr.shift();
    for (i=0;i<buildArr.length;i++)
	{
		buildArr[i]=buildArr[i].substr(0, buildArr[i].length-1);
	}

	console.log(buildArr);
        

	
          var newBuildArray=[]; //to push in mysql
          while(buildArr.length)  newBuildArray.push(buildArr.splice(0,1));

    	     pool.getConnection(function(err,connection) {
            if (err) throw err;
          console.log("Connected to DB!! Inserting Values.......!");
      
          connection.query(SQL_Query,[newBuildArray], function (err, result) {
        
            connection.release();
            if (err) throw err;
              console.log("Builds Inserted");
                                                 });
                             });
   		 
      });
		res.end();	
}); 
app.listen(2456);
