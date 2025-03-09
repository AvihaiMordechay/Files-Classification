import { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import theme from '../../styles/theme';
import constats from '../../styles/constats';
import { useUser } from '../../context/UserContext';

const UserSettingsScreen = ({ navigation }) => {
    const { user, updateUserName } = useUser();
    const [userName, setUserName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [isChanged, setIsChanged] = useState(false);

    const handleUpdateName = async () => {
        try {
            await updateUserName(userName);
            setIsChanged(false);
        } catch (error) {
            console.log(error);
            setUserName(user?.name);
        }
    };

    const handleUpdateEmail = () => {
        navigation.navigate('UpdateEmailScreen', { email });
    };

    const handleUpdatePassword = () => {
        navigation.navigate('UpdatePasswordScreen');
    };

    const handleEnable2FA = () => {
        navigation.navigate('TwoFactorAuthScreen');
    };



    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.formContainer}>

                            <Text style={styles.label}>שם משתמש</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="הכנס שם משתמש חדש"
                                    onChangeText={(text) => {
                                        setUserName(text);
                                        setIsChanged(text !== user.name);
                                    }}
                                    value={userName}
                                />
                            </View>

                            {isChanged && (
                                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateName}>
                                    <Text style={styles.saveButtonText}>שמור שם</Text>
                                </TouchableOpacity>
                            )}


                            <Text style={styles.label}>אימייל</Text>
                            <View style={[styles.inputContainer, styles.disabledInputContainer]}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            <TouchableOpacity style={styles.actionButton} onPress={handleUpdateEmail}>
                                <Text style={styles.actionButtonText}>שינוי כתובת אימייל</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={handleUpdatePassword}>
                                <Text style={styles.actionButtonText}>שינוי סיסמה</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={handleEnable2FA}>
                                <Text style={styles.actionButtonText}>הפעלת אימות דו-שלבי</Text>
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
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'stretch',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: constats.sizes.font.medium + 1,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
        textAlign: 'right',
    },
    inputContainer: theme.inputContainer,
    disabledInputContainer: {
        opacity: 0.5,
    },
    input: theme.input,
    actionButton: {
        backgroundColor: constats.colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: constats.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: constats.sizes.font.small,
        fontWeight: 'bold',
    },
});
