const rp = require('request-promise');
var cheerio = require('cheerio'); // Basically jQuery for node.js
 
var options = {
    "rejectUnauthorized": false,
    uri: 'https://sdp-qa-nexus.corp.yodlee.com:1443/nexus/content/repositories/yodlee/alerts/',
    transform: function (body) {
        return cheerio.load(body);
    }
};
let title=options('title');
console.log(title.text());
