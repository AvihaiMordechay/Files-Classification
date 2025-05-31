import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConstats } from '../../styles/constats';
import { TouchableWithoutFeedback } from 'react-native';

const FileUploadModal = ({ visible, content, buttons, onClose }) => {
    const constats = useConstats();

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalView: {
            width: '100%',
            backgroundColor: 'white',
            padding: 20,
            alignItems: 'center',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        modalTitle: {
            fontSize: constats.sizes.font.mediumPlus,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        modalContent: {
            fontSize: constats.sizes.font.mediumPlus + 2,
            textAlign: 'center',
            marginBottom: 30,
        },
        buttonContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
        },
        buttonWrapper: {
            alignItems: 'center',
            marginHorizontal: 5,
            paddingHorizontal: 5,
            maxWidth: 105,
        },
        button: {
            width: '100%',
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            borderRadius: 15,
            backgroundColor: constats.colors.backgroundButton,
        },
        buttonText: {
            fontSize: constats.sizes.font.medium,
            textAlign: "center",
            marginTop: 8,
        },
        primaryButton: {
            backgroundColor: constats.colors.primary,
        },
    });

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalContent}>{content}</Text>
                        <View style={styles.buttonContainer}>
                            {buttons.map((button, index) => (
                                <View key={index} style={styles.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            button.isPrimary && styles.primaryButton
                                        ]} onPress={button.onPress}
                                    >
                                        {button.icon && <Ionicons name={button.icon} size={constats.sizes.icon.FileUploadModal} color={button.isPrimary ? 'white' : 'black'} />}
                                    </TouchableOpacity>
                                    <Text style={styles.buttonText}>{button.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};


export default FileUploadModal;