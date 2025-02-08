import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { isFirstTime, deleteDB, printDB } from './services/database';
import { auth } from './services/firebase';
import { NavigationContainer } from '@react-navigation/native';
import Spinner from './components/Spinner';
import RegistrationNavigator from './navigation/RegistrationNav';
import AuthenticatedNavigator from './navigation/AuthenticatedNav';
import LoginNavigator from './navigation/LoginNav';
import User from './user/user';

const isAuthenticated = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null); // 'new', 'authenticated', 'unauthenticated'
  const [user, setUser] = useState(new User());


  useEffect(() => {
    initApplication();
  }, []);

  const initApplication = async () => {
    try {
      if (await isFirstTime()) {
        setUserStatus('new');
      }
      else if (await isAuthenticated()) {
        await user.initDB();
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



