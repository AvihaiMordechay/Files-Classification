import { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import theme from '../../styles/theme';
import constats from '../../styles/constats';

const UserSettingsScreen = ({ route }) => {
    const { user } = route.params || {};
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');

    const handleSaveChanges = () => {
        // כאן תוסיף את הלוגיקה שלך לעדכון הנתונים
    };

    return (
        <SafeAreaProvider style={styles.background}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>שם מלא</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={userName}
                                onChangeText={setUserName}
                                value={userName}
                            />

                            <Text style={styles.label}>אימייל</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={setEmail}
                                value={email}
                            />

                            <Text style={styles.label}>סיסמה חדשה</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="********"
                                secureTextEntry
                                onChangeText={setPassword}
                                value={password}
                            />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                                <Text style={styles.saveButtonText}>שמירה</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default UserSettingsScreen;

const styles = StyleSheet.create({
    background: {
        backgroundColor: constats.colors.background,
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    formContainer: {
        width: '80%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: constats.colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
