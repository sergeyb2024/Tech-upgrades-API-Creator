const fs = require('fs'),
xml2js = require('xml2js');
const { log: C}  = require('console');
//documentation https://www.npmjs.com/package/xml2js

//normal xml
const scrapeObjArr = []
const parser = new xml2js.Parser();
fs.readFile('./MiamiGP_8.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for(const [key, value] of Object.entries(result)){
            const vFlow = value.Flow
            vFlow.forEach(item => {
                for(const text of item.Para){
                    const scrapedObject = {
                        keyId: item.$,
                        textValue: text.Line
                    }
                    scrapeObjArr.push(scrapedObject.textValue)
                }
            })            
        }
    });
});