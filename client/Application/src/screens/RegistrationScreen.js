import React from 'react';
import theme from '../styles/theme';
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';


const validationSchema = Yup.object().shape({
    name: Yup.string().required('יש למלא שם מלא'),
    email: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'אימייל לא תקין'
        )
        .required('יש למלא אימייל'),
    password: Yup.string()
        .required('יש למלא סיסמה')
        .min(8, 'הסיסמה חייבת להיות באורך של לפחות 8 תווים')
        .matches(/^[A-Za-z0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]*$/, 'הסיסמה חייבת להכיל אותיות באנגלית, מספרים או סימנים מיוחדים בלבד'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'הסיסמאות אינן תואמות')
        .required('יש לאמת את הסיסמה'),
});

const RegistrationScreen = ({ route, navigation }) => {
    const { user } = route.params || {};

    const handleRegister = async (values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const firebaseUserAuth = userCredential.user;

            await user.createDB(firebaseUserAuth.uid, values.name, values.email, "male");

            navigation.replace('Application', { user: user });
        } catch (error) {
            console.error('Error creating user:', error.message);
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
                        {/* לוגו */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoBox}></View>
                            <View style={[styles.logoBox, styles.logoBoxOverlap]}></View>
                        </View>
                        <Text style={styles.title}>Files Classifiction</Text>

                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleRegister}
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
                                            placeholder="שם"
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={styles.errorText}>{errors.name}</Text>
                                        )}
                                    </View>

                                    {/* אימייל */}
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

                                    {/* סיסמה */}
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

                                    {/* אישור סיסמה */}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="אימות סיסמה"
                                            secureTextEntry
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                        )}
                                    </View>

                                    {/* כפתור הרשמה */}
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => {
                                            if (Object.keys(errors).length === 0 && Object.keys(touched).length > 0) {
                                                handleSubmit();
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttonText}>המשך</Text>
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
        width: 50,
        height: 50,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    },
    logoBoxOverlap: {
        marginLeft: -15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '80%',
    },
    inputContainer: {
        backgroundColor: '#F1F5F9',
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
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 12,
        marginTop: 5,
        textAlign: 'right',
    },
});

export default RegistrationScreen;
