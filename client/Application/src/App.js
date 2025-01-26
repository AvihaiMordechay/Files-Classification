import { StyleSheet } from 'react-native';
import TabNavigator from './navigation/TabNavigator';
import User from './user/user';
import foldersCategories from '../assets/data/foldersCategories.json'


export default function App() {
  const user = new User("אביחי", "מרדכי", "male", "avihaimo1@gmail.com", require("../assets/profile.jpg"), foldersCategories);
  return (
    <>
      <TabNavigator user={user} />
      {/* <AppNavigator /> */}
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
