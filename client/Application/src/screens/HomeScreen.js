import { View, Text } from 'react-native';
import Header from '../components/Header';

const HomeScreen = ({ route }) => {
    const { user } = route.params || {};
    return (
        <>
            <View>
                <Header user={user} />
                <Text>דף הבית</Text>
            </View>
        </>
    );
};

export default HomeScreen;