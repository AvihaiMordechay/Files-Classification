import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import theme from "../../styles/theme";

// קומפוננטת AlertModal מציגה מודל מותאם אישית עם כותרת, הודעה וכפתורים דינמיים
const AlertModal = ({ visible, onClose, title, message, buttons }) => {
    return (
        <Modal
            animationType="fade" // האנימציה בעת הצגת המודל
            transparent={true}    // תצוגת המודל תהיה שקופה (לא תסגור את כל המסך)
            visible={visible}    // קובע אם המודל גלוי או לא
            onRequestClose={onClose}  // פעולה שתופעל אם המשתמש לוחץ על כפתור סגירה או עובר למסך אחר
        >
            {/* TouchableWithoutFeedback מאפשר סגירת המודל אם נוגעים מחוץ לו */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    {/* KeyboardAvoidingView מונע מהמקלדת לחסום את המודל */}
                    <KeyboardAvoidingView style={styles.centeredView}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            {/* Pressable מאפשר למנוע פעולות אם המשתמש לוחץ בתוך המודל */}
                            <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                                {/* כותרת של המודל */}
                                <Text style={styles.modalTitle}>{title}</Text>

                                {/* הודעת התראה (הטקסט הראשי) */}
                                <Text style={styles.modalMessage}>{message}</Text>

                                {/* התצוגה של הכפתורים */}
                                <View style={styles.modalButtonsContainer}>
                                    {buttons.map((button, index) => (
                                        // יצירת כפתור לכל אובייקט ב- buttons
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.modalButton, button.style]}
                                    onPress={button.onPress}
                                    >
    <Text style={styles.modalButtonText}>
        {button.text ? String(button.text) : "לחץ כאן"}
    </Text>
</TouchableOpacity>
                                    ))}
                                </View>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AlertModal;

const styles = StyleSheet.create({
    modalOverlay: theme.modal.modalOverlay,
    centeredView: {
        flex: 1,
        justifyContent: 'center',  // ממקם את המודל במרכז
        alignItems: 'center',      // ממקם את המודל במרכז
        paddingTop: '50%',         // מוסיף ריפוד עליון כדי להזיז את המודל למטה
    },
    scrollViewContent: theme.modal.scrollViewContent,
    modalView: theme.modal.modalView,
    modalTitle: theme.modal.modalTitle,
    modalMessage: theme.modal.modalLabel,
    modalButtonsContainer: {
        flexDirection: 'row',   // כפתורים יוצגו אחד מעל השני
        justifyContent: 'center',  // ממקם את הכפתורים במרכז
        alignItems: 'center',      // ממקם את הכפתורים במרכז
        marginTop: 20,             // מרווח עליון מהתוכן
        width: '80%',              // רוחב אחיד לכפתורים
    },
    modalButton: {
        ...theme.modal.modalSaveButton,
        height: 50,  // גובה אחיד לכל הכפתורים
        width: '100%', // רוחב אחיד לכל הכפתורים
        marginBottom: 10,  // מרווח בין הכפתורים
    },
    modalButtonText: theme.modal.modalSaveButtonText,
});
