const fs = require('fs'),
xml2js = require('xml2js');
const { log: C}  = require('console');

// --xml_words_as_elements
const scrapeObjArr = []
const parser = new xml2js.Parser();
fs.readFile('./MiamiGP_8_as_words.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for(const [key, value] of Object.entries(result)){
            const vFlow = value.Flow
            vFlow.forEach(item => {
                for(const text of item.Para){
                    const scrapedObject = {
                        keyId: Object.values(item.$),
                        textValue: {
                            textLine: text.Line,
                            words: Object.values(text)
                        }
                    }
                    scrapeObjArr.push(scrapedObject.textValue)
                    scrapeObjArr.forEach(item => {
                        C(scrapedObject.keyId, item.textLine)
                    })

                }
            })            
        }
    });
});