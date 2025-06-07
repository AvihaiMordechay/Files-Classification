import React, { useState } from 'react';
import { useConstats } from '../../styles/constats';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { getTheme } from '../../styles/theme';
import { useUser } from '../../context/UserContext';
import AlertModal from '../../components/modals/AlertModal';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('יש למלא שם'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'אימייל לא תקין'
    )
    .required('יש למלא אימייל'),
  password: Yup.string()
    .required('יש למלא סיסמה')
    .min(8, 'הסיסמה חייבת להיות באורך של לפחות 8 תווים')
    .matches(
      /^[A-Za-z0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]*$/,
      'הסיסמה חייבת להכיל אותיות באנגלית, מספרים או סימנים מיוחדים בלבד'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'הסיסמאות אינן תואמות')
    .required('יש למלא סיסמה'),
  gender: Yup.string().required('יש לבחור מגדר'),
});

const RegistrationScreen = () => {
  const constats = useConstats();
  const theme = getTheme(constats);
  const { createUser, loadUser } = useUser();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const navigation = useNavigation();


  const handleRegister = async (values, { setFieldError }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const firebaseUserAuth = userCredential.user;

      try {
        await createUser(
          firebaseUserAuth.uid,
          values.name,
          values.gender,
          values.email
        );
        await loadUser();
        navigation.navigate('Application');
      } catch (dbError) {
        if (dbError.code === 'ERR_UNEXPECTED') {
          setAlertTitle('שגיאה');
          setAlertMessage('לא ניתן ליצור את המשתמש כעת, אנא נסה שנית');
          setAlertVisible(true);
        }
        await deleteUser(firebaseUserAuth);
        console.log('Delete user from firebase');
      }
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        setAlertTitle('שגיאה');
        setAlertMessage("אין חיבור לאינטרנט");
        setAlertVisible(true);
      } else if (error.code === 'auth/email-already-in-use') {
        setFieldError('email', 'האימייל כבר קיים במערכת');
      } else {
        setAlertTitle('שגיאה');
        setAlertMessage('האימייל כבר קיים במערכת');
        setAlertVisible(true);
      }
      console.log('Error creating user:', error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoImage: {
      width: constats.sizes.icon.width,
      height: constats.sizes.icon.height,
      marginBottom: 20,
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
    genderContainer: {
      flexDirection: 'row',
      backgroundColor: constats.colors.backgroundButton,
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 15,
    },
    genderButton: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedGender: {
      backgroundColor: constats.colors.primary,
    },
    genderText: {
      fontSize: constats.sizes.font.medium,
      color: 'gray',
    },
    selectedText: {
      color: 'white',
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>


            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                gender: 'male',
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
                setFieldValue,
              }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={'שם'}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        values.gender === 'female' && styles.selectedGender,
                      ]}
                      onPress={() => setFieldValue('gender', 'female')}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          values.gender === 'female' && styles.selectedText,
                        ]}
                      >
                        נקבה
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        values.gender === 'male' && styles.selectedGender,
                      ]}
                      onPress={() => setFieldValue('gender', 'male')}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          values.gender === 'male' && styles.selectedText,
                        ]}
                      >
                        זכר
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {touched.gender && errors.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={'אימייל'}
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
                      placeholder={'סיסמה'}
                      secureTextEntry
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={'אימות סיסמה'}
                      secureTextEntry
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (
                        Object.keys(errors).length === 0 &&
                        Object.keys(touched).length > 0
                      ) {
                        handleSubmit();
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>הרשם</Text>
                  </TouchableOpacity>
                  <AlertModal
                    visible={alertVisible}
                    onClose={() => setAlertVisible(false)}
                    title={alertTitle || 'שגיאה'}
                    message={alertMessage}
                    buttons={[
                      { text: 'סגור', onPress: () => setAlertVisible(false) },
                    ]}
                  />
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default RegistrationScreen;
