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

const checkRegex = (stringData) => {
    // api structure blueprint
    const testObj = {
          Year: Number,
          RaceNo: Number,
          RaceName: String,
          Constructor: String,
          ComponentNo: Number,
          UpdatedComponent: String,
          PrimaryReason: String,
          GeometricDifferences: String,
          Description: String,
    }
    
    const regexPattern = /(?<key>Year|RaceNo|RaceName|Constructor|ComponentNo|UpdatedComponent|PrimaryReason|GeometricDifferences|Description)[^a-zA-Z]+(?<value>[^,]+)/g;
    
    let match;
    while ((match = regexPattern.exec(stringData)) !== null) {
      const { key, value } = match.groups;
      testObj[key] = value.trim();
    }
    return testObj;
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
                C("obj.desc ",obj.description.output.toString())

                /**
                 * tester for regex
                 */
                const testerForRegex = obj.description.output.toString()
                for(let i = 0; i < testerForRegex; i++){
                    if(testerForRegex[i] === Number){
                        const newobj = {id: [i], desc : {
                            details: testerForRegex[i] !== Number
                        }} 
                        C(newobj)

                    }
                }
                const foundata = checkRegex('Front Corner')
                C('found data ',foundata)
              
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



