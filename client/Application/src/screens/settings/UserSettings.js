import { View, Text } from 'react-native';
import Header from '../../components/Header';

const UserSettingsScreen = ({ route }) => {
    const { user } = route.params || {};

    return (
        <>
            <View>
                <Text>הגדרות משתמש</Text>
            </View>
        </>
    );
};

export default UserSettingsScreen;