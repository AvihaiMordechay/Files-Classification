import { NavigationContainer } from '@react-navigation/native';
import { UserProvider, useUser } from './src/context/UserContext';
import Spinner from './src/components/Spinner';
import RegistrationNavigator from './src/navigation/RegistrationNav';
import AuthenticatedNavigator from './src/navigation/AuthenticatedNav';
import LoginNavigator from './src/navigation/LoginNav';

const MainNavigator = () => {
  const { userStatus } = useUser();

  if (!userStatus) {
    return <Spinner />;
  }

  return (
    <NavigationContainer>
      {userStatus === 'new' && <RegistrationNavigator />}
      {userStatus === 'authenticated' && <AuthenticatedNavigator />}
      {userStatus === 'unauthenticated' && <LoginNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <MainNavigator />
    </UserProvider>
  );
}
