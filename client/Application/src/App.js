import Navigator from './navigation/Navigator';
import User from './user/user';
import foldersCategories from '../assets/data/foldersCategories.json'
import AddFiles from './components/AddFilesComponent';
import RegistrationScreen from './screens/RegistrationScreen';

export default function App() {
  const user = new User("אביחי", "מרדכי", "male", "avihaimo1@gmail.com", require("../assets/profile.jpg"), foldersCategories);
  return (
    <>
      {/* <Navigator user={user} /> */}
      {/* <AddFiles /> */}
      <RegistrationScreen />
    </>
  );
}

