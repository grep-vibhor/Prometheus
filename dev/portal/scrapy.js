const cheerio = require('cheerio');
const request = require('request');
const cheerioTableparser = require('cheerio-tableparser');
const conif = require('node-console-input');
/*
console.log("Enter A Deployment from following list::\n");
console.log("[automation,l1-feature-restarts,l1-ycc,l1-feature-restarts-wealth,l1-feature-stable,nextgen,nextgenFL_jboss10,wells_fargo-jboss10,BCTS,PSD2,PVT1,PVT2,PVT3,PVT4,auto_platform,autosit,l2-release,l3-environment,MR-Mainline,MR-Prodlike,SIT_Wealth,automation-mainline,MR-stabilization,MR-Weekly,CIT,CIT_YSL,DIT,Dev_Performance,l2-yi,l1-yi]");

var myEnv = conif.getConsoleInput("Enter a Environment: ", false);
console.log(myEnv+"\n");
*/
var express = require('express');
var app =express();


const mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "192.168.113.58",
  user: "test",
  password: "12345678",
  database: "portal",
  multipleStatements: true  
});

                var automation = ["Automation"];
    
                var l1_feature_restarts=["L1 Restart YSL"];
                var l1_ycc=["L1 Restart YCC"];
                var l1_feature_restarts_wealth=["L1 Restart Wealth"];
                var l1_feature_stable=["L1 Stable SAAS"];
                var nextgen=[ "PFM 3.0 Regular" , "PFM 3.0 Backup" , "NextGen Channel" , "NextGen Timely" , "PFM 3.0 SAML"];
                var nextgenFL_jboss10=["Fincheck QA"];
                var BCTS=["Sense QA"];
                var PSD2=["PSD QA"];
                var wells_fargo_jboss10=["Wells Fargo(Infra)"];
                var PVT1=["PVT1"];
                var PVT2=["PVT2"];
                var PVT3=["PVT3"];
                var PVT4=["PVT4"];
    
                var auto_platform=["Auto NPR"];
                var autosit=["Auto SIT"];
                var l2_release=["L2 Environment"];
                var l3_environment=["L3 Environment"];
                var MR_Mainline=["MainLine"];
                var MR_Prodlike=["ProdLike"];
                var SIT_Wealth=["Wealth SIT"];

                var automation_mainline=["Auto Main"];
                var MR_stabilization=["STAB"];
                var MR_Weekly=["MR Weekly"];
                

                var CIT=["CIT"];
                var CIT_YSL=["CIT YSL"];
                var DIT=["DIT","DIT FL"];
                
                var Dev_Performance=["DEV Performance"];
                

                var l2_yi=["YI L2"];
                var l1_yi=["YI L1"];
app.post('/updateDeployments',function(req,res){
                var myEnv = req.query.env;                
                if (automation.includes(myEnv))
                     var deployment = "automation";
                else if (l1_feature_restarts.includes(myEnv))
                     var deployment = "l1-feature-restarts";
                else if (l1_feature_stable.includes(myEnv))
                     var deployment = "l1-feature-stable";
                else if (l1_ycc.includes(myEnv))
                     var deployment = "l1-ycc";
                else if (l1_feature_restarts_wealth.includes(myEnv))
                     var deployment = "l1-feature-restarts-wealth";
                else if (nextgen.includes(myEnv))
                      var deployment = "nextgen";
                else if (nextgenFL_jboss10.includes(myEnv))
                      var deployment = "nextgenFL_jboss10";
                else if (BCTS.includes(myEnv))
                      var deployment = "BCTS";
               
                else if (PSD2.includes(myEnv))
                      var deployment = "PSD2";
                else if (wells_fargo_jboss10.includes(myEnv))
                      var deployment = "wells_fargo-jboss10";
                else if (PVT1.includes(myEnv))
                      var deployment = "PVT1";
                else if (PVT2.includes(myEnv))
                      var deployment = "PVT2";
                else if (PVT3.includes(myEnv))
                      var deployment = "PVT3";
                else if (PVT4.includes(myEnv))
                       var deployment = "PVT4";
                else if (auto_platform.includes(myEnv))
                      var deployment = "auto_platform";
                else if (autosit.includes(myEnv))
                      var deployment = "autosit";
                else if (l2_release.includes(myEnv))
                      var deployment = "l2-release";
                else if (l3_environment.includes(myEnv))
                      var deployment = "l3-environment";
                else if (MR_Mainline.includes(myEnv))
                      var deployment = "MR-Mainline";
                else if (MR_Prodlike.includes(myEnv))
                       var deployment = "MR-Prodlike";
                else if (SIT_Wealth.includes(myEnv))
                       var deployment = "SIT_Wealth";
                else if (automation_mainline.includes(myEnv))
                        var deployment = "automation-mainline";
                else if (MR_stabilization.includes(myEnv))
                        var deployment = "MR-stabilization";
                else if (MR_Weekly.includes(myEnv))
                        var deployment = "MR-weekly";

                else if (CIT.includes(myEnv))
                        var deployment = "CIT";
                else if (CIT_YSL.includes(myEnv))
                        var deployment = "CIT_YSL";
                else if (DIT.includes(myEnv))
                        var deployment = "DIT";
              
                else if (Dev_Performance.includes(myEnv))
                        var deployment = "Dev_Performance";
                
                else if (l2_yi.includes(myEnv))
                        var deployment = "l2-yi";
                else if (l1_yi.includes(myEnv))
                        var deployment = "l1-yi";


              var uri="https://qadeploymentspro.corp.yodlee.com/inventory/DPortal/DashBorad/pages/tables/data.php?env="+deployment;

              SQL_Query="REPLACE INTO components(component,env) VALUES ?";
              console.log(SQL_Query);
              request({
                  rejectUnauthorized: false,
                  method: 'GET',
                  url: uri,
                  
              }, (err, res, body) => {

                  if (err) return console.error(err);

                    let $ = cheerio.load(body);
                    cheerioTableparser($);
                    let data= $("table").parsetable(true,true,true);
                    ipArr=data[0];
                    ipArr.shift();
                    instanceArr=data[1];
                    instanceArr.shift();
                    componentArr=data[2]
                    componentArr.shift();
              	const fullComponentNames=[];
                    for (i=0;i<ipArr.length;i++)
              	{
              		fullComponentNames[i]=ipArr[i] + "_instance-" + instanceArr[i] + "_" + componentArr[i];
              	}
              	console.log(fullComponentNames);
                      


                      var newfullComponentNames=[]; //to push in mysql
                      while(fullComponentNames.length)  newfullComponentNames.push(fullComponentNames.splice(0,1));
              	for(i=0;i<newfullComponentNames.length;i++)
              	{
              		newfullComponentNames[i].push(deployment);
              	}


                  	 pool.getConnection(function(err,connection) {
            if (err) throw err;
          console.log("Connected to DB!! Inserting Values.......!");
      
          connection.query(SQL_Query,[newfullComponentNames], function (err, result) {
        
            connection.release();
            if (err) throw err;
              console.log("Deployments Inserted");
                                                 });
                             });
                  
              });
              res.end();
});
app.listen(9001);