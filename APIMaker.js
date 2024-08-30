const { log: C } = console;
const fs = require('fs')


function getEntireDescriptionIntoArray(team) {
  // Extract all matched text sections
  const regex = /\d+\n([\s\S]+?)(?=\n\d+|\n*$)/g;
  let match;
  const sections = [];
  while ((match = regex.exec(team)) !== null) {
    sections.push(match[1].trim().split('\n').filter(line => line.trim() !== ''));
  }
  return sections;
}

// getEntireDescriptionIntoArray()
function getUpdateDescriptionOnly(entireDescription) {
  return entireDescription.map(subArray => {
    let result = [];
    let tempString = '';

    subArray.forEach(item => {
      if (item[0] === item[0].toLowerCase()) {
        tempString += ' ' + item;
      } else {
        if (tempString) {
          result.push(tempString.trim());
          tempString = '';
        }
        result.push(item);
      }
    });
    if (tempString) {
      result.push(tempString.trim());
    }
    return result;
  });
}

let objects = []

function distributeToObject(team) {
  let counter = 1;
  let options = { part: '', reason: '', geoDiff: '', desc: '' }
  getUpdateDescriptionOnly(getEntireDescriptionIntoArray(team)).map(item => {
    if (item.length !== 7) {
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
      RaceNo: 16,
      RaceName: 'Dutch Grand Prix',
      Constructor: "Visa Cash App RB",
      RequiredEventDisplay: 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2024',
      ComponentNo: counter++,
      UpdatedComponent: options.part,
      PrimaryReason: options.reason,
      GeometricDifferences: options.geoDiff,
      Description: options.desc
    })
    
  })
  return objects
}

C(distributeToObject())

// Deprecated
// function getConstructorsName(text) {
//   //positive lookahead and lookbehind for any sequential capital letter characters
//   const rx = /\b(?=\w)[A-Z]+\s?[A-Z]\s?\d?\b(?<=\w)/gm
//   return text.match(rx).toString().replace(/,/g, ' ')

// function getPartIds(text) {
//   // will put out array of part id's
//   let result = ''
//   const rx = /^\b(?=\d)\d(?<=\w)/gm
//   for (const id of text.match(rx)) {
//     result = id
//     C(result)
//   }
//   return result
// }