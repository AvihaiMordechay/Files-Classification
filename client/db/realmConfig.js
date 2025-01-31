import Realm from 'realm';

// הגדרת המודל שלך
const FileSchema = {
  name: 'File',
  properties: {
    _id: 'int',  // מזהה ייחודי
    name: 'string',  // שם הקובץ
    fileUri: 'string',  // מיקום הקובץ במערכת הקבצים המקומית
    createdAt: 'date',  // זמן יצירת הקובץ
  },
};

// יצירת חיבור ל-Realm עם המודל
const realm = new Realm({
  schema: [FileSchema],
  schemaVersion: 1,  // גרסה של הסכימה
});

export default realm;
