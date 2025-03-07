import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { isFirstTime, deleteDB, printDB, createDB, createFolder, getFoldersDetails, changeFolderName, addFileToFolder, deleteFileFromFolder, deleteFolder, changeFileName, addFileToFavorites, deleteFavoriteFile, getAllFavoritesFiles, getFilesByFolder } from './src/services/database';
import { auth } from './src/services/firebase';
import { NavigationContainer } from '@react-navigation/native';
import Spinner from './src/components/Spinner';
import RegistrationNavigator from './src/navigation/RegistrationNav';
import AuthenticatedNavigator from './src/navigation/AuthenticatedNav';
import LoginNavigator from './src/navigation/LoginNav';
import User from './src/user/user';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null); // 'new', 'authenticated', 'unauthenticated'
  const [user, setUser] = useState(new User());

  useEffect(() => {
    initApplication();
  }, []);

  const isAuthenticated = async () => {
    const loginState = new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    if (loginState) {
      await user.initDB();
    }
  };

  const initApplication = async () => {
    try {
      // setUserStatus('authenticated');

      if (await isFirstTime()) {
        setUserStatus('new');
      }
      else if (await isAuthenticated(user)) {
        setUserStatus('authenticated');
      }
      else {
        setUserStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <NavigationContainer>
      {userStatus === 'new' && <RegistrationNavigator user={user} />}
      {userStatus === 'authenticated' && <AuthenticatedNavigator user={user} />}
      {userStatus === 'unauthenticated' && <LoginNavigator user={user} />}
    </NavigationContainer>
  );
}



