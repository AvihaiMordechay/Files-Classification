import React from 'react';
import constats from '../../styles/constats';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import theme from '../../styles/theme';
import { getUserEmail, updateLastLogin } from '../../services/database';
import { useUser } from '../../context/UserContext';
import { use } from 'react';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'אימייל לא תקין'
        )
        .required('יש למלא אימייל'),
    password: Yup.string()
        .required('יש למלא סיסמה')
        .min(8, 'הסיסמה חייבת להיות באורך של לפחות 8 תווים')
});

const LoginScreen = ({ navigation }) => {
    const { loadUser } = useUser();
    const handleLogin = async (values, { setFieldError }) => {
        try {
            // todo: add check if the values email === email in the database!!
            await signInWithEmailAndPassword(auth, values.email, values.password);
            await loadUser();
            await updateLastLogin();
            navigation.replace('Application');
        } catch (error) {
            if (error.code === 'ERR_UNEXPECTED') {
                Alert.alert('שגיאה', 'לא ניתן לטעון את המשתמש כעת, אנא נסה שנית')
            } else if (error.code === 'auth/network-request-failed') {
                Alert.alert("שגיאה", "אין חיבור לאינטרנט");
            } else if (error.code === 'auth/invalid-credential') {
                setFieldError('email', 'האימייל או הסיסמה אינם נכונים');
            } else {
                console.log(error.code);
                Alert.alert("שגיאה", error.message);
            }
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoBox}></View>
                            <View style={[styles.logoBox, styles.logoBoxOverlap]}></View>
                        </View>
                        <Text style={styles.title}>Files Classification</Text>

                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                            }) => (
                                <View style={styles.form}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="אימייל"
                                            keyboardType="email-address"
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                        />
                                        {touched.email && errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="סיסמה"
                                            secureTextEntry
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                        />
                                        {touched.password && errors.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            if (Object.keys(errors).length === 0 && Object.keys(touched).length > 0) {
                                                handleSubmit();
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttonText}>התחבר</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.linkButton}
                                        onPress={() => navigation.replace('Registration')}
                                    >
                                        <Text style={styles.linkText}>אין לך חשבון? הירשם כאן</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    logoBox: theme.authLogoBox,
    logoBoxOverlap: {
        marginLeft: -15,
    },
    title: {
        fontSize: constats.sizes.font.large,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '80%',
    },
    inputContainer: theme.inputContainer,
    input: theme.input,
    button: theme.authButton,
    buttonText: {
        color: constats.colors.backgroundButton,
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
    },
    errorText: theme.errorText,
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: constats.colors.primary,
        fontSize: constats.sizes.font.small,
    },
});

export default LoginScreen;