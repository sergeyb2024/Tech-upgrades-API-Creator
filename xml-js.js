const { log: C}  = require('console');
const convert = require('xml-js');
const xml = require('fs').readFileSync('./MiamiGP_8.xml', 'utf8');
const options = {ignoreComment: true, alwaysChildren: true, alwaysArray: true, ignoreAttributes: true};
const result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)

// "start_2": "nodemon xml-js.js"
//docs: https://www.npmjs.com/package/xml-js

const descriptors = Object.getOwnPropertyDescriptors(result)
const descElemVal = descriptors.elements.value
const elements = descElemVal[0].elements
const elemsArr = Object.entries(elements)
for(const [key, value] of Object.entries(elemsArr)){
    for(const elemArrValue of Object.values(value)){
        for(const [elem, val] of Object.entries(elemArrValue)){
           C(val.elements)
        }
    }
}
// C(Object.groupBy(descriptors, ({ elements }) => elements))
// C(result)


// const obj = Object.fromEntries(result)
// C(obj)