import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import constats from '../styles/constats';

const Spinner = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={80} color={constats.colors.primary} />
            <Text style={styles.text}>טוען...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginRight: 7,
        marginTop: 15,
        fontSize: 20,
    },
});

export default Spinner;
