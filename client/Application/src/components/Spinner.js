import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../styles/theme';

const Spinner = ({ text = "טוען..." }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={80} color={theme.colors.primary} />
            <Text style={styles.text}>{text}</Text>
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
