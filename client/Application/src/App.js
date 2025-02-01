import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      // פתיחת מסד הנתונים
      const db = await SQLite.openDatabaseAsync('myapp.db');

      // יצירת טבלה עם שדה "first_time" בוליאני
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          first_time BOOLEAN
        );
      `);

      // בדיקה אם יש רשומה קיימת בטבלה
      const result = await db.getAllAsync('SELECT * FROM settings');

      if (result.length === 0) {
        // אם אין רשומה, זוהי הפעם הראשונה שהאפליקציה נפתחת
        // הוספת רשומה עם first_time = true
        await db.runAsync('INSERT INTO settings (first_time) VALUES (?)', [true]);
        setIsFirstTime(true);
      } else {
        // אם יש רשומה, קבלת הערך של first_time
        const firstTimeValue = result[0].first_time;
        setIsFirstTime(firstTimeValue);

        if (firstTimeValue) {
          // לאחר הפעם הראשונה, עדכון הערך ל-false
          await db.runAsync('UPDATE settings SET first_time = ? WHERE id = ?', [false, result[0].id]);
        }
      }

    } catch (error) {
      console.error('Database error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SQLite First Time Demo</Text>
      <Text style={styles.message}>
        {isFirstTime === null
          ? 'Loading...'
          : isFirstTime
            ? 'Welcome! 🎉 This is your first time here.'
            : 'Welcome back! 😊'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    marginTop: 20,
  },
});
