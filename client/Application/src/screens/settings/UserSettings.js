import { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import theme from '../../styles/theme';
import constats from '../../styles/constats';
import { useUser } from '../../context/UserContext';
import EmailUpdateModal from '../../components/modals/EmailUpdateModal';
import { auth } from '../../services/firebase';

const UserSettingsScreen = ({ navigation }) => {
    const { user, updateUserName } = useUser();
    const [userName, setUserName] = useState(user.name || '');
    const [saveNameButtonVisible, setSaveNameButtonVisible] = useState(false);
    const [emailModalVisible, setEmailModelVisible] = useState(false);

    const handleUpdateName = async () => {
        try {
            await updateUserName(userName);
            setSaveNameButtonVisible(false);
        } catch (error) {
            console.log(error);
            setUserName(user?.name);
        }
    };


    const handleUpdatePassword = () => {
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
                                        setSaveNameButtonVisible(text !== user.name);
                                    }}
                                    value={userName}
                                />
                            </View>

                            {saveNameButtonVisible && (
                                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateName}>
                                    <Text style={styles.saveButtonText}>שמור שם</Text>
                                </TouchableOpacity>
                            )}


                            <Text style={styles.label}>אימייל</Text>
                            <View style={[styles.inputContainer, styles.disabledInputContainer]}>
                                <TextInput
                                    style={styles.input}
                                    value={auth.currentUser.email || ''}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>


                            <TouchableOpacity style={styles.actionButton} onPress={() => setEmailModelVisible(true)}>
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
                    <EmailUpdateModal
                        visible={emailModalVisible}
                        onClose={() => setEmailModelVisible(false)}
                    />
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
    // Modal Overlay - ניתן ללחוץ עליו לסגירת המודל
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: constats.sizes.font.large,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'right',
        alignSelf: 'stretch',
    },
    modalInputContainer: {
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    modalInput: {
        flex: 1,
        color: '#333',
        fontSize: constats.sizes.font.medium,
        textAlign: 'right',
        fontWeight: '500',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    modalSaveButton: {
        backgroundColor: constats.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    modalSaveButtonText: {
        color: '#fff',
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
    },
    modalCancelButton: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    modalCancelButtonText: {
        color: '#666',
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
});