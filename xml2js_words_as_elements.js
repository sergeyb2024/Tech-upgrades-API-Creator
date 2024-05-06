const fs = require('fs'),
xml2js = require('xml2js');
const { log: C}  = require('console');
const { type } = require('os');

// start_1
// --xml_words_as_elements


const parser = new xml2js.Parser();
fs.readFile('./MiamiGP_8_as_words.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        const generalMap = new Map()
        for(const [key, value] of Object.entries(result)){
            generalMap.set(key, value)
        }
        for(const [key, values] of generalMap.entries()){
            generalMap.set(key, values.Flow)
        }
        const myMap = new Map(generalMap)
        const finalMap = new Map()
        for(const [key, val] of myMap.entries()){
            for(const x of val){
                for(const para of x.Para){
                    for(const line of para.Line){
                        finalMap.set(para.$, line.Word)
                        const finalObj = {
                            key: para.$.id,
                            value: line.Word.toString()
                        }
                        C(finalObj)
                    }
                }
            }
        }
    });
});