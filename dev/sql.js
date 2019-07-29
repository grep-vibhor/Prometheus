var mysql = require('mysql');

var express = require('express');
var bodyParser=require('body-parser');

var app =express();
app.use(bodyParser.json());

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "192.168.113.58",
  user: "test",
  password: "12345678",
  database: "testjs"
});

app.post('/trackon',function(req,res){
       console.log("This is  a post request for alerts");
        var alertsArrayOfJSON=req.body.alerts;
        var len=alertsArrayOfJSON.length;
        const alertsArray = [];
        for(i=0;i<len;i++)
   	{
      		 const alertInfo=[];
         	 alertInfo.push(alertsArrayOfJSON[i].labels.alertname,alertsArrayOfJSON[i].labels.instance,alertsArrayOfJSON[i].labels.job,alertsArrayOfJSON[i].startsAt);
         	alertsArray.push(alertInfo);

        }

      
    pool.getConnection(function(err,connection) {
     if (err) throw err;
  	console.log("Connected to DB!! Inserting Value.......!");
      
       connection.query("REPLACE INTO alerts(Alert_Type,Host,Environment,Alert_TimeStamp) VALUES ?",[alertsArray], function (err, result) {
        
        connection.release();
        if (err) throw err;
          console.log("Alert Inserted");
                                                 });
                             });
    

});

app.listen(2711);
