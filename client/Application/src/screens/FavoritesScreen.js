import { View, Text } from 'react-native';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';

const FavoritesScreen = () => {
    const { user } = useUser();

    return (
        <>
            <View>
                <Header />
                <Text>מועדפים</Text>
            </View>
        </>
    );
};

export default FavoritesScreen;