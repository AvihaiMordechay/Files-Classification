import { StyleSheet } from 'react-native';
import Navigator from './navigation/Navigator';
import User from './user/user';
import foldersCategories from '../assets/data/foldersCategories.json'
import AddFiles from './components/AddFilesComponent';


export default function App() {
  const user = new User("אביחי", "מרדכי", "male", "avihaimo1@gmail.com", require("../assets/profile.jpg"), foldersCategories);
  return (
    <>
      <AddFiles />
      {/* <Navigator user={user} /> */}
    </>
  );
}

