import { StyleSheet } from 'react-native';
import TabNavigator from './navigation/TabNavigator';
import User from './user/user';

export default function App() {
  const user = new User("אביחי", "מרדכי", "male", "avihaimo1@gmail.com", require("../assets/profile.jpg"));
  return (
    <>
      <TabNavigator user={user} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
