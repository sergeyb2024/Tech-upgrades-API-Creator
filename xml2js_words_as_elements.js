const fs = require('fs'),
xml2js = require('xml2js');
const { log: C}  = require('console');

// start_3
// --xml_words_as_elements


const parser = new xml2js.Parser();
fs.readFile('./MiamiGP_8_as_words.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for(const [key, value] of Object.entries(result)){
            const vFlow = value.Flow
            vFlow.forEach(item => {
                for(const text of item.Para){
                    const scrapedObject = {
                        keyId: Object.values(item.$),
                        textLine: text.Line,
                        words: Object.values(text)[1]                       
                    }
                    const textObj = {
                        key: scrapedObject.keyId,
                        value: scrapedObject.textLine
                    }
                    const wordVal = textObj.value
                    for(const [key, val] of Object.entries(wordVal)){
                        C('key', key, 'keyId', scrapedObject.keyId, 'val',val.Word)
                    }                    
                }
            })            
        }
    });
});