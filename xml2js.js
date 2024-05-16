const fs = require('fs')
const xml2js = require('xml2js');
const { log: C } = require('console');
const testingData = require('./mock-data')


/**
 *  noligatures = regular. Single flow. Paragraph ID includes entire column
 *  z-order = horizontal read instead of standard vertical
 *  no effect for verbosity levels
 *  output box will contain text height in indentation in px
 *  no use for words as elements
 */



/**
 *  checkRegex will respond with an object
 *  with key = "compornents" || "reasonForUpdate"
 *  it will serve to asign values to proper API keys
 */
function checkRegex(input){
    let componentExist = false
    let primaryReason = false
    const obj = 
        {
            components : 'Front Wing,Nose,Sidepod Inlet,Floor Edge,Cooling Louvres,Coke\/Engine Cover,Front Wing Endplate,Floor Body,Beam Wing,Rear Wing,Rear Corner,Rear Suspension,Front Suspension,Floor Fences,Diffuser,Front Corner,Floor Corner,Halo,Headrest,Mirror/im',
            primaryReason : '/^Performance-Flow Conditioning$/im, /^Performance-Local Load$/im, /^Circuit Specific-Balance Range$/im, /^Driver Cooling$/i, /^Performance-Local Load$/im'
        }

    const isMatchComponents = obj.components.match(input) 
    const isMatchReason = obj.primaryReason.match(input)
    isMatchComponents ? C(componentExist = true) : C(componentExist = false)
    isMatchReason ? C(primaryReason = true) : C(primaryReason = false)

    return {components: isMatchComponents} || {primaryReason: isMatchReason}
}


/**
 *  obj keys used to build the object
 *  k1, k2, k3
*/
const k1 = 'id'; const k2 = 'description'; const k3 = 'output'
var obj = {}; var paragraphs; var line;
const parser = new xml2js.Parser();
try {

    /**
     * There are multiple PDF files that will need to be inside an array
     * for FS to process as bulk and merge directly to update existing API
     */
    fs.readFile('./MiamiGP-z-o.xml', 'utf-8', (err, data) => {
        err ?? C(err)
        parser.parseString(data, (err, result) => {
            err ?? C(err)

            /**
             *  XML loaded data tags :
             *  Page => Flow -> Para -> Line
             */
            for (const item of result.Page.Flow) {
                paragraphs = item.Para
            }
            paragraphs.map(element => {
                line = element.Line

                /**
                 *  separates id's from all other string by
                 *  validating if isNaN, will attach Number as ID
                 *  and all the rest is nested in an object.
                 *  Number of id's is the number of rows per 
                 *  given sheet
                 */
                !isNaN(parseInt(element.Line)) ? 
                obj[k1] = parseInt(line) : 
                obj[k2] = {}; 
                obj[k2][k3] = element.Line
                
            });
        });
    })
}
catch (err) {
    return `${err} while reading or parsing file`
}

/**
 *  writeFile is used to create a preliminary 
 *  JSON file for the API. Temporary testing
 *  solution.
 */
function writeFile(data){
    try{
        fs.writeFileSync('testApi.json', JSON.stringify(data),  {
            encoding: "utf-8"
        }, () => {
            C('successfully wrote to directory')
        })
    }catch(error){
        return `${error} while writing file`
    }
}


/**
 *  removes duplicates to get exact list
 *  of existing parts in order to create
 *  a regex filter. Use testData.js
 */
function removeDuplicates(arr) {
    let unique = arr.reduce(function (acc, curr) {
            if (!acc.includes(curr.UpdatedComponent))
                acc.push(curr.UpdatedComponent);
            return acc;
        }, []);
        
    return unique.toString();
}


// OPTIONAL
// var finalObj = {}
// const outputVal = obj.description.output
// const descriptionVal = obj.description
// const idVal = obj.id
// finalObj[k1] = idVal;
// finalObj[k2] = {}
// finalObj[k2][k3] = outputVal




