import React from 'react';
import theme from '../../styles/theme';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

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

const LoginScreen = ({ route, navigation }) => {
    const { user } = route.params || {};

    const handleLogin = async (values) => {
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            await user.initDB();
            navigation.replace('Application', { user: user });
        } catch (error) {
            console.error('Error signing in:', error.message);
        }
    };

    return (
        <SafeAreaProvider style={styles.background}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

                                    {/* קישור להרשמה */}
                                    <TouchableOpacity
                                        style={styles.linkButton}
                                        onPress={() => navigation.navigate('Registration', { user })}
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
    background: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    logoBox: {
        width: theme.sizes.logoBox.width,
        height: theme.sizes.logoBox.height,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    },
    logoBoxOverlap: {
        marginLeft: -15,
    },
    title: {
        fontSize: theme.sizes.font.large,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '80%',
    },
    inputContainer: {
        backgroundColor: theme.colors.backgroundInput,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    input: {
        fontSize: 17,
        textAlign: 'right',
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: theme.colors.backgroundButton,
        fontSize: theme.sizes.font.medium,
        fontWeight: 'bold',
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: theme.sizes.font.small,
        marginTop: 5,
        textAlign: 'right',
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: theme.colors.primary,
        fontSize: theme.sizes.font.small,
    },
});

export default LoginScreen;