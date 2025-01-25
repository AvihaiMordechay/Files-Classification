import { View, Text } from 'react-native';
import Header from '../components/Header';

const FavoritesScreen = ({ route }) => {
    const { user } = route.params || {};

    return (
        <>
            <View>
                <Header user={user} />
                <Text>מועדפים</Text>
            </View>
        </>
    );
};

export default FavoritesScreen;