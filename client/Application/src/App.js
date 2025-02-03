import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isFirstTime, createFolder, deleteDB, printDB, addFile, addFileToFavorites, createDB, deleteFileDB } from '../src/services/database';

export default function App() {
  const [isFirstTimeFlag, setIsFirstTimeFlag] = useState(false);

  useEffect(() => {
    checkFirstTime();
    // deleteDB();
  }, []);

  const checkFirstTime = async () => {
    try {
      await addFile("test", 1, "png", "/c/asd/rs");
      await printDB();
      if (await isFirstTime()) {
        await createDB("123", "אביחי", "test", "male");
        await createFolder("Medical");
        await addFile("test", 1, "png", "/c/asd/rs");
        await addFileToFavorites(1);
        setIsFirstTimeFlag(true);
        await printDB();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SQLite First Time Demo</Text>
      <Text style={styles.message}>
        {isFirstTimeFlag === false
          ? 'Welcome back!'
          : 'Welcome! This is your first time here.'
        }
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