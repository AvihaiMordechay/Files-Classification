import RNFS from 'react-native-fs';  // חיבור למערכת הקבצים המקומית

// פונקציה לשמירת קובץ למערכת הקבצים המקומית
function saveFileToFileSystem(fileName, data) {
  const path = RNFS.DocumentDirectoryPath + '/' + fileName;

  RNFS.writeFile(path, data, 'utf8')
    .then(() => {
      console.log('File saved at:', path);
    })
    .catch((err) => {
      console.log('Error saving file:', err);
    });
}

// פונקציה לקרוא קובץ ממערכת הקבצים המקומית
function readFileFromFileSystem(fileName) {
  const path = RNFS.DocumentDirectoryPath + '/' + fileName;

  RNFS.readFile(path, 'utf8')
    .then((contents) => {
      console.log('File content:', contents);
    })
    .catch((err) => {
      console.log('Error reading file:', err);
    });
}

export { saveFileToFileSystem, readFileFromFileSystem };
