import { NavigationContainer } from '@react-navigation/native';
import { UserProvider, useUser } from './src/context/UserContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'; // ← חדש!
import Spinner from './src/components/Spinner';
import RegistrationNavigator from './src/navigation/RegistrationNav';
import AuthenticatedNavigator from './src/navigation/AuthenticatedNav';
import LoginNavigator from './src/navigation/LoginNav';
import { FontScaleProvider } from './src/context/AccessibilityContext';

const MainNavigator = () => {
  const { userStatus } = useUser();

  if (!userStatus) {
    return <Spinner text="טוען נתוני משתמש..." isUploadFile={false} visible={true} />;
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
    <FontScaleProvider>
      <UserProvider>
        <ActionSheetProvider>
          <MainNavigator />
        </ActionSheetProvider>
      </UserProvider>
    </FontScaleProvider>

  );
}
