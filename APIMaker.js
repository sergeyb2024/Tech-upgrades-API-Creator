const {log: C} = require('console');
const textOutput = `MCLAREN FORMULA 1 TEAM
Updated
component
Primary
reason for
update
Geometric differences compared to
previous version
Brief description on how the update
works
1
Front Wing
Performance -
Flow Conditioning
New, completely revised Front Wing.
The completely revised Front Wing Geometry
results in a significant improvement of flow control
which in conjunction with the updated Front Corner
and Front Suspension, results in an overall load
gain.
2
Front
Suspension
Performance -
Flow Conditioning
New Front Suspension Geometry
The new front suspension has been designed to suit
the new front wing and to support and enhance the
improvement in flow condition.
3
Front Corner
Performance -
Flow Conditioning
Revised Front Brake Duct and Winglet
The new front brake duct has been designed to suit
the new front wing and to support and enhance the
improvement in flow condition.
4
Floor Body
Performance -
Local Load
Completely revised Floor
The revised floor has been designed in conjunction
with the new Sidepod Inlet and Bodywork to
increase overall load in all conditions.
5
Sidepod Inlet
Performance -
Flow Conditioning
Revised Sidepod Inlet
The revised Sidepod Inlet has been designed to
complement the change in onset flow and in
conjunction with the bodywork results in an
improved flow to the rear of the car.
6
Coke/Engine
Cover
Performance -
Flow Conditioning
New Bodywork and Engine Cover
The new Bodywork and Engine Cover results in an
improvement in efficiency and flow conditioning in
conjunction with the Sidepod Inlet.
7
Cooling
Louvres
Performance -
Flow Conditioning
Updated Louvre Range
With the revised Bodywork Shape, the cooling
louvre range has been updated, to suit the change
in overall flow field.`



let objects = []

function getConstructorsName (text) {
    //positive lookahead and lookbehind for any sequential capital letter characters
    const rx = /\b(?=\w)[A-Z]+\s?[A-Z]\s?\d?\b(?<=\w)/gm
    return text.match(rx).toString().replace(/,/g, ' ')
}

// function getPartIds (text) {
//     // will put out array of part id's
//     let result = ''
//     const rx = /^\b(?=\d)\d(?<=\w)/gm
//     for (const id of text.match(rx)){
//         result = id
//         C(result)
//     }
//     return result
// }


// Extract all matched text sections
function getEntireDescriptionIntoArray (text) {
  const regex = /\d+\n([\s\S]+?)(?=\n\d+|\n*$)/g;
  let match;
  const sections = [];
  while ((match = regex.exec(textOutput)) !== null) {
    sections.push(match[1].trim().split('\n').filter(line => line.trim() !== ''));
  }
  return sections;
}

function getUpdateDescriptionOnly(entireDescription) {
  return entireDescription.map(subArray => {
    let result = [];
    let tempString = '';

    subArray.forEach(item => {
      if (item[0] === item[0].toLowerCase()) {
        // If the line starts with a lowercase letter, append it to tempString
        tempString += ' ' + item;
      } else {
        // If tempString is not empty, push it to result before starting a new sentence
        if (tempString) {
          result.push(tempString.trim());
          tempString = '';
        }
        // Push the current item to result
        result.push(item);
      }
    });
    // Push any remaining tempString to result
    if (tempString) {
      result.push(tempString.trim());
    }
    return result;
  });
}



function distributeToObject () {
  let options = {part: '', reason: '', geoDiff: '', desc: ''}
  getUpdateDescriptionOnly(getEntireDescriptionIntoArray()).map(item => {
    if(item.length !== 7){
      options.part = item[0];
      options.reason = item[1].concat(item[2])
      options.geoDiff = item[3]
      options.desc = item[4].concat(item[5])
    } else {
      options.part = item[0].concat(item[1])
      options.reason = item[2].concat(item[3])
      options.geoDiff = item[4]
      options.desc = item[5].concat(item[6])
    }
    objects.push({
    Year: 2024,
    RaceNo: '',
    RaceName: '',
    Constructor: getConstructorsName(textOutput),
    ComponentNo: '',
    UpdatedComponent: options.part,
    PrimaryReason: options.reason,
    GeometricDifferences: options.geoDiff,
    Description: options.desc
})
    // object.UpdatedComponent = options.part
    // object.PrimaryReason = options.reason
    // object.GeometricDifferences = options.geoDiff
    // object.Description = options.desc
    // C(object)
  })
  return objects
}


C(distributeToObject())