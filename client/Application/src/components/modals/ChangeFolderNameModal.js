import React, { useState } from "react";
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
    Keyboard,
} from "react-native";
import { getTheme } from "../../styles/theme";
import { useUser } from "../../context/UserContext";
import AlertModal from "./AlertModal";
import { Formik } from "formik";
import * as Yup from "yup";
import { useConstats } from "../../styles/constats";

const ChangeFolderNameModal = ({ visible, onClose, folderName }) => {
    const constats = useConstats();
    const theme = getTheme(constats);
    const { changeFolderName } = useUser();
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [error, setError] = useState("");
    const letterLimit = 15;

    const validationSchema = Yup.object().shape({
        newName: Yup.string()
            .required("יש להזין שם חדש")
            .max(letterLimit, "שם התיקייה חורג מהגודל המותר"),
    });

    const handleClose = () => {
        setError("");
        onClose();
    };

    const closeAlertModal = () => {
        setAlertModalVisible(false);
        handleClose();
    };

    const handleUpdateName = async (values, { setSubmitting, setErrors }) => {
        setError("");
        try {
            console.log
            if (folderName === values.newName.trim()) {
                setError("אנא בחר שם אחר מהשם הנוכחי");
                return;
            }
            await changeFolderName(folderName, values.newName.trim());
            setAlertModalVisible(true);
        } catch (error) {
            console.log(error.message);

            if (error.message === 'alreadyExists') {
                setError("שם התיקייה קיים במערכת");
            } else {
                setError("לא ניתן לשנות את שם התיקייה");
                handleClose();
            }
        } finally {
            setSubmitting(false);
        }
    };

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
            color: "red",
            fontSize: constats.sizes.font.small,
            textAlign: "right",
            marginBottom: 8,
        },
    });

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView style={styles.centeredView}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                <Text style={styles.modalTitle}>שינוי שם תיקייה</Text>

                                <Text style={styles.modalLabel}>שם התיקייה הנוכחית</Text>
                                <View style={styles.modalInputContainer}>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={folderName}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                </View>

                                <Formik
                                    initialValues={{ newName: "" }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleUpdateName}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                        <>
                                            <Text style={styles.modalLabel}>שם התיקייה החדשה</Text>
                                            <View style={styles.modalInputContainer}>
                                                <TextInput
                                                    style={styles.modalInput}
                                                    placeholder="הכנס שם חדש"
                                                    placeholderTextColor="#999"
                                                    onChangeText={handleChange("newName")}
                                                    onBlur={handleBlur("newName")}
                                                    value={values.newName}
                                                />
                                                {touched.newName && errors.newName && (
                                                    <Text style={styles.errorText}>{errors.newName}</Text>
                                                )}
                                                {error !== "" && (
                                                    <Text style={styles.errorText}>{error}</Text>
                                                )}
                                            </View>

                                            <View style={styles.modalButtonsContainer}>
                                                <TouchableOpacity style={styles.modalCancelButton} onPress={handleClose}>
                                                    <Text style={styles.modalCancelButtonText}>ביטול</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[
                                                        styles.modalSaveButton,
                                                        (!values.newName || isSubmitting) && styles.disabledButton,
                                                    ]}
                                                    onPress={handleSubmit}
                                                    disabled={!values.newName || isSubmitting}
                                                >
                                                    <Text style={styles.modalSaveButtonText}>שמור</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </Formik>

                                <AlertModal
                                    visible={alertModalVisible}
                                    onClose={closeAlertModal}
                                    title="הודעה"
                                    message="שם התיקייה עודכן בהצלחה"
                                    buttons={[
                                        {
                                            text: "אישור",
                                            onPress: closeAlertModal,
                                        },
                                    ]}
                                />
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};


export default ChangeFolderNameModal;
