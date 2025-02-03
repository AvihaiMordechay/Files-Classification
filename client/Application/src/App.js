import Navigator from './navigation/Navigator';
import User from './user/user';
import foldersCategories from '../assets/data/foldersCategories.json'
import AddFiles from './components/AddFilesComponent';
import RegistrationScreen from './screens/RegistrationScreen';

export default function App() {
  const [isFirstTimeFlag, setIsFirstTimeFlag] = useState(false);

  useEffect(() => {
    checkFirstTime();
    // deleteDB();
  }, []);

  const checkFirstTime = async () => {
    try {
      // await printDB();
      if (await isFirstTime()) {
        await createApplicationDB("123", "אביחי", "test");
        await createFolder("Medical");
        await addFile("test", "Medical", "רפואה", "png", "/c/asd/rs");
        setIsFirstTimeFlag(true);
        await printDB();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {/* <Navigator user={user} /> */}
      {/* <AddFiles /> */}
      <RegistrationScreen />
    </>
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
