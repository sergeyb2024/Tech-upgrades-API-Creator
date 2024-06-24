const fs = require('fs')
const xml2js = require('xml2js');
const { log: C } = require('console');



/**
 *  noligatures = regular. Single flow. Paragraph ID includes entire column
 *  z-order = horizontal read instead of standard vertical
 *  no effect for verbosity levels
 *  output box will contain text height in indentation in px
 *  no use for words as elements
 */



const testObj = {
    Year: 2024,
    RaceNo: "",
    RaceName: "",
    Constructor: "",
    ComponentNo: "",
    UpdatedComponent: "",
    PrimaryReason: "",
    GeometricDifferences: "",
    Description: "",
}

function getPrimaryReason (string) {
    /**
     * identical function as get Description. I will combine both late to reuse the code
     */
    for (const sentence of string.split('.')) {
        const trimmedSentence = sentence.trim();
        const validateSentenceLength = trimmedSentence && trimmedSentence[0].toUpperCase() === trimmedSentence[0] && trimmedSentence.split(' ').length

        let lowercaseCount = 0;
        let uppercaseCount = 0;
        for (const word of trimmedSentence.split(' ')) {
            if (word.toLowerCase() === word) {
                lowercaseCount++;
            } else {
                uppercaseCount++;
            }
        }
        
        if(validateSentenceLength < 7 && uppercaseCount > 4  && trimmedSentence.indexOf(' As Well As')){
           return testObj.PrimaryReason = trimmedSentence
        }
    }
}

function inputComponents(string) {
    /**
     * This should recognise the component names and place into key value pairs
     */
    const regex = /|Nose|Sidepod Inlet|Floor Edge|Cooling - Louvres|Coke\/Engine - Cover|Front Wing Endplate|Floor Body|Beam Wing|Rear Wing|Rear Corner|Rear Suspension|Front Suspension|Floor Fences|Diffuser|Front Corner|Floor Corner|Halo|Headrest|Mirror|Front Wing/gm;
    let m;
    for(const words of string.split('.')){
        if(words.indexOf(regex)){
            testObj.UpdatedComponent = regex.exec(string)
        }
    }
}


function getDescriptionsString(string) {
    /**
     *  function will validate number of words as well as capital letter.
     *  usually descriptions are the longest. Updated components have 2 to 3 words and Primary reason may vary,
     *  therefore each value has an "as well as"
     */
    for (const sentence of string.split('.')) {
        const trimmedSentence = sentence.trim();
        const validateSentenceLength = trimmedSentence && trimmedSentence[0].toUpperCase() === trimmedSentence[0] && trimmedSentence.split(' ').length

        let lowercaseCount = 0;
        let uppercaseCount = 0;
        for (const word of trimmedSentence.split(' ')) {
            if (word.toLowerCase() === word) {
                lowercaseCount++;
            } else {
                uppercaseCount++;
            }
        }
        if (validateSentenceLength >= 10) {
            if (uppercaseCount < 12) {
               return testObj.Description = trimmedSentence;
            }
        } else if(validateSentenceLength <= 2 && uppercaseCount <= 2){
           return testObj.UpdatedComponent = trimmedSentence
        } 
    }
}

function getNameOfUpdatedComponent(text) {
    // \d\n\n\w+\s\n = is the part name all by itself?
    // \d\n\n\w+\s\n\w+ = then grab next word to combine together

    const pattern = /\d\n\n\w+\s\n\w+/gm
    const m = text.match(pattern)
    C(m)
}
function getUpdateKey (text) {
    const pattern = /\d/gm
    const m = text.match(pattern)
    // C(m)

}

var paragraphs; var line;
const parser = new xml2js.Parser();
try {

    /**
     *  Read xml file page by page to extract text
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
                const newArr = []
                newArr.push(line)
                /**
                 *  Format text to convinient format in order to fit the exisiting API structure
                 */
                const firstTrim = newArr.slice(-1).toString().split('\n').join(';').trim().replace(/,\s/, ' ')
                const secondTrim = firstTrim.split('-,;').join('As Well As ')
                const thirdTrim = secondTrim.split(/(?<=\w),;(?=[a-z]\w)/g).join(' ').replace('Front,;Suspension', 'Front Suspension')
                const fourthTrim = thirdTrim.split(/-?\W\;(?=[A-Z]\w|\s\[a-z]\w)/g).join('. ').replace('Coke/Engine. Cover', 'Coke/Engine Cover').replace('Cooling. Louvres', 'Cooling Louvres')

                /**
                 *  Call on each function to validate which text is appropriate for 
                 *  the individual key/values
                 */
                testObj.PrimaryReason = getPrimaryReason(fourthTrim)
                testObj.Description = getDescriptionsString(fourthTrim)
                let testArray = []
                const regexPatternForParts = /(?<=[A-Z])\w+,(?=\n[A-Z]\w+\n)/gm
                
            });
        });
    })
}
catch (err) {
    return `${err} while reading or parsing file`
}



