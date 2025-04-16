import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import theme from "../../styles/theme";
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordModal = ({ visible, onClose }) => {
    const [generalError, setGeneralError] = useState('');

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('כתובת מייל לא תקינה').required('שדה המייל הוא חובה'),
        currentPassword: Yup.string().required('יש להזין את הסיסמה הנוכחית'),
        newPassword: Yup.string().min(8, 'הסיסמה החדשה חייבת להכיל לפחות 8 תווים').required('יש להזין סיסמה חדשה'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'הסיסמאות החדשות אינן תואמות')
            .required('יש לאמת את הסיסמה החדשה'),
    });

    const handleChangePassword = async (values, { setSubmitting }) => {
        setGeneralError('');
        try {
            const { email, currentPassword, newPassword } = values;
            const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword);
            await updatePassword(userCredential.user, newPassword);
            alert("הסיסמה שונתה בהצלחה!");
            onClose();
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setGeneralError('האימייל או הסיסמה שגויים');
            } else {
                setGeneralError('לא קיים משתמש עם המייל הזה או שהסיסמה שגויה');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView style={styles.centeredView}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                <Text style={styles.modalTitle}>שחזור סיסמה</Text>

                                <Formik
                                    initialValues={{
                                        email: '',
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmNewPassword: ''
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, formikHelpers) => handleChangePassword(values, formikHelpers)}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                        <>
                                            {/* Email Field */}
                                            <Text style={styles.modalLabel}>אימייל</Text>
                                            <View style={styles.modalInputContainer}>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="הכנס אימייל"
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    onChangeText={handleChange('email')}
                                                    onBlur={handleBlur('email')}
                                                    value={values.email}
                                                />
                                            </View>
                                            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                            {generalError !== '' && <Text style={styles.errorText}>{generalError}</Text>}

                                            {/* Current Password Field */}
                                            <Text style={styles.modalLabel}>סיסמה נוכחית</Text>
                                            <View style={styles.modalInputContainer}>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="הכנס סיסמה נוכחית"
                                                    secureTextEntry
                                                    onChangeText={handleChange('currentPassword')}
                                                    onBlur={handleBlur('currentPassword')}
                                                    value={values.currentPassword}
                                                />
                                            </View>
                                            {touched.currentPassword && errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}

                                            {/* New Password Field */}
                                            <Text style={styles.modalLabel}>סיסמה חדשה</Text>
                                            <View style={styles.modalInputContainer}>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="הכנס סיסמה חדשה"
                                                    secureTextEntry
                                                    onChangeText={handleChange('newPassword')}
                                                    onBlur={handleBlur('newPassword')}
                                                    value={values.newPassword}
                                                />
                                            </View>
                                            {touched.newPassword && errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

                                            {/* Confirm New Password Field */}
                                            <Text style={styles.modalLabel}>אימות סיסמה חדשה</Text>
                                            <View style={styles.modalInputContainer}>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="אמת סיסמה חדשה"
                                                    secureTextEntry
                                                    onChangeText={handleChange('confirmNewPassword')}
                                                    onBlur={handleBlur('confirmNewPassword')}
                                                    value={values.confirmNewPassword}
                                                />
                                            </View>
                                            {touched.confirmNewPassword && errors.confirmNewPassword && <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>}

                                            {/* Buttons */}
                                            <View style={styles.modalButtonsContainer}>
                                                <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                                    <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.modalSaveButton}
                                                    onPress={handleSubmit}
                                                >
                                                    <Text style={styles.modalSaveButtonText}>אישור</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </Formik>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    centeredView: theme.modal.centeredView,
    scrollViewContent: theme.modal.scrollViewContent,
    modalView: theme.modal.modalView,
    modalTitle: theme.modal.modalTitle,
    modalLabel: theme.modal.modalLabel,
    modalInputContainer: theme.modal.modalInputContainer,
    modalInput: theme.modal.modalInput,
    modalButtonsContainer: theme.modal.modalButtonsContainer,
    modalSaveButton: theme.modal.modalSaveButton,
    modalSaveButtonText: theme.modal.modalSaveButtonText,
    modalCancelButton: theme.modal.modalCancelButton,
    modalCancelButtonText: theme.modal.modalCancelButtonText,
    disabledButton: theme.modal.disabledButton,

    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 8,
        marginTop: 4
    }
});
