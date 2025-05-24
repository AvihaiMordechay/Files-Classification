import React, { useState } from 'react';
import constats from '../../styles/constats';
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import theme from '../../styles/theme';
import { updateLastLogin } from '../../services/database';
import { useUser } from '../../context/UserContext';
import ForgetPasswordModal from '../../components/modals/ForgetPasswordModal';
import AlertModal from '../../components/modals/AlertModal';
import strings from '../../styles/strings';

const { validation, placeholders, buttons, errors } = strings.loginScreen;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      validation.emailInvalid
    )
    .required(validation.emailRequired),
  password: Yup.string()
    .required(validation.passwordRequired)
    .min(8, validation.passwordMinLength),
});

const LoginScreen = ({ navigation }) => {
  const { loadUser } = useUser();
  const [isForgetPasswordModalVisible, setIsForgetPasswordModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const handleLogin = async (values, { setFieldError }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      await loadUser();
      await updateLastLogin();
      navigation.replace('Application');
    } catch (error) {
      if (error.code === 'ERR_UNEXPECTED') {
        setAlertTitle(strings.alert.titleError);
        setAlertMessage(errors.unexpected);
        setAlertVisible(true);
      } else if (error.code === 'auth/network-request-failed') {
        setAlertTitle(strings.alert.titleError);
        setAlertMessage(errors.noInternet);
        setAlertVisible(true);
      } else if (error.code === 'auth/invalid-credential') {
        setFieldError('email', validation.invalidCredentials);
      } else {
        console.log(error.code);
        setAlertTitle(strings.alert.titleError);
        setAlertMessage(errors.unknown);
        setAlertVisible(true);
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}></View>
              <View style={[styles.logoBox, styles.logoBoxOverlap]}></View>
            </View>
            <Text style={styles.title}>{strings.title}</Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={placeholders.email}
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
                      placeholder={placeholders.password}
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
                      if (
                        Object.keys(errors).length === 0 &&
                        Object.keys(touched).length > 0
                      ) {
                        handleSubmit();
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>{buttons.login}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => setIsForgetPasswordModalVisible(true)}
                  >
                    <Text style={styles.linkText}>{buttons.forgotPassword}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>

        <ForgetPasswordModal
          visible={isForgetPasswordModalVisible}
          onClose={() => setIsForgetPasswordModalVisible(false)}
        />
        <AlertModal
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          title={alertTitle}
          message={alertMessage}
          buttons={[{ text: strings.alert.close, onPress: () => setAlertVisible(false) }]}
        />
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
    alignSelf: 'flex-end',
  },
  linkText: {
    color: constats.colors.primary,
    fontSize: constats.sizes.font.small,
    textDecorationLine: 'underline',
    paddingRight: 10,
  },
});

export default LoginScreen;
