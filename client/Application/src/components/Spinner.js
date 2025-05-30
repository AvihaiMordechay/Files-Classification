import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useConstats } from '../styles/constats';

const Spinner = ({ visible = false, text = 'טוען...', isUploadFile = false }) => {
    const constats = useConstats();

    const styles = StyleSheet.create({
        spinner: {
            width: 180,
            height: 180,
            borderBottomColor: constats.colors.primary,
        },
        modalBackground: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        uploadOffset: {
            marginBottom: 10,
        },
        container: {
            padding: 28,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EEEEEEFF'

        },
        text: {
            color: '#212121D9',
            marginRight: 7,
            fontSize: constats.sizes.font.large,
            marginTop: -35
        },
    });
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            statusBarTranslucent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <LottieView
                        source={
                            isUploadFile
                                ? require('../../assets/SpinnerUploadFile.json')
                                : require('../../assets/Spinner.json')
                        } autoPlay
                        loop
                        style={[styles.spinner, isUploadFile && styles.uploadOffset]}
                    />
                    <Text style={[
                        styles.text,
                        !isUploadFile && { marginTop: 0 }
                    ]}>{text}</Text>
                </View>
            </View>
        </Modal>
    );
};


export default Spinner;