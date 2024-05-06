const { log: C}  = require('console');
const convert = require('xml-js');
const xml = require('fs').readFileSync('./MiamiGP_8.xml', 'utf8');
const options = {ignoreComment: true, alwaysChildren: true, alwaysArray: true, ignoreAttributes: true};
const result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)

//docs: https://www.npmjs.com/package/xml-js


let descObject = {}
function getTextDescriptionOfUpdatesFromXML () {
    for (const [key, value] of Object.entries(result)){
        C('value',value)
        for(const [fKey, fValue] of Object.entries(value)){
            C('fValue', fValue.elements)
            for(const [pKey, pValue] of Object.entries(fValue)){
                C('pValue', pValue[0].elements)
            }
        }
    }
}

getTextDescriptionOfUpdatesFromXML()