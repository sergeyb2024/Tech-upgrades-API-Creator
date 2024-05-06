const fs = require('fs'),
xml2js = require('xml2js');
const { log: C}  = require('console');
// start_3
//documentation https://www.npmjs.com/package/xml2js

const myMap = new Map()
let outerObj = {}
const parser = new xml2js.Parser();
fs.readFile('./MiamiGP_7.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for(const [key, value] of Object.entries(result)){
            for(const flowItem of value.Flow){
                for(const line of flowItem.Para){
                    const innerObj = {
                        lineId: line.$.id,
                        desc: line.Line.toString()
                    }
                    outerObj = {
                        column: flowItem.$.id,
                        value: innerObj 
                    }
                    C(outerObj)
                    myMap.set(outerObj)        
                }
            }
        }
    });
});
