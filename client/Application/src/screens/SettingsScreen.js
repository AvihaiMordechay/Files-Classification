import { View, Text } from 'react-native';
import Header from '../components/Header';

const SettingsScreen = ({ route }) => {
    const { user } = route.params || {};

    return (
        <>
            <View>
                <Header user={user} />
                <Text>הגדרות</Text>
            </View>
        </>
    );
};

export default SettingsScreen;