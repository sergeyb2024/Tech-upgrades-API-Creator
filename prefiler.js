const fs = require('fs').promises;
const path = require('path');
const filePath = './Files';

/**
 *  `readFiles`, `getRawData`, `main` : 
 *   will read file contents (.txt files) and merge them into
 */

const readFiles = async (filePath) => {
  try {
    const files = await fs.readdir(filePath);
    const fileReadPromises = files.map(file => fs.readFile(path.join(filePath, file), 'utf8'));
    const fileContents = await Promise.all(fileReadPromises);
    return fileContents.join('\n');
  } catch (err) {
    console.error(`Error reading files: ${err}`);
    throw err;
  }
};

const getRawData = async () => {
  const data = await readFiles(filePath);
  return data;
};

const main = async () => {
  try {
    const rawData = await getRawData()
    fs.writeFile('./filesMerged.txt', rawData)
  } catch (err) {
    console.error(err);
  }
};


main().then(result => {
  let text = result
}).catch(console.error)

