import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { isFirstTime, deleteDB, printDB } from './services/database';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationNavigator from './navigation/RegistrationNav';
import AuthenticatedNavigator from './navigation/AuthenticatedNav';
import User from './user/user';

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
      // TODO: WRITRE isAuthenticated()
      else if (true) {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userStatus === 'new' && <RegistrationNavigator user={user} />}
      {userStatus === 'authenticated' && <AuthenticatedNavigator user={user} />}
      {/* {userStatus === 'unauthenticated' && <LoginNavigator />} */}
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
