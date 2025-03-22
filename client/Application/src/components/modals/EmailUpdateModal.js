import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import constats from '../../styles/constats';

const EmailUpdateModal = ({ visible, onClose, email, newEmail, setNewEmail, handleUpdateEmail }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.centeredView}>
                    <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>עדכון כתובת אימייל</Text>

                        <Text style={styles.modalLabel}>אימייל נוכחי</Text>
                        <View style={styles.modalInputContainer}>
                            <TextInput
                                style={styles.modalInput}
                                value={email}
                                editable={false}
                                selectTextOnFocus={false}
                            />
                        </View>

                        <Text style={styles.modalLabel}>אימייל חדש</Text>
                        <View style={styles.modalInputContainer}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="הכנס אימייל חדש"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                onChangeText={setNewEmail}
                                value={newEmail}
                            />
                        </View>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                                <Text style={styles.modalCancelButtonText}>ביטול</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalSaveButton, !newEmail && styles.disabledButton]}
                                onPress={handleUpdateEmail}
                                disabled={!newEmail}
                            >
                                <Text style={styles.modalSaveButtonText}>שמור</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    modalLabel: {
        fontSize: constats.sizes.font.medium,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    modalInputContainer: {
        height: 50,
        backgroundColor: constats.colors.backgroundInput,
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
        backgroundColor: constats.colors.backgroundButton,
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

export default EmailUpdateModal;
