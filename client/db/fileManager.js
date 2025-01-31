import realm from './realmConfig';  // חיבור ל-Realm

// פונקציה לשמירת קובץ ל-Realm
function saveFileToLocalDb(name, fileUri) {
  realm.write(() => {
    realm.create('File', {
      _id: Date.now(),  // מזהה ייחודי
      name,
      fileUri,
      createdAt: new Date(),
    });
  });
}

// פונקציה לקרוא את כל הקבצים מה- Realm
function getFilesFromLocalDb() {
  const files = realm.objects('File');
  return files;
}

export { saveFileToLocalDb, getFilesFromLocalDb };
