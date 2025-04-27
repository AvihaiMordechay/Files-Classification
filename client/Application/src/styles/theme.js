import { Platform } from 'react-native';
import constats from "./constats";

const theme = {
    inputContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: Platform.select({ ios: 15, android: 8 }),
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
        fontSize: constats.sizes.font.medium + 1,
        textAlign: 'right',
    },
    errorText: {
        color: constats.colors.danger,
        fontSize: constats.sizes.font.small,
        marginTop: 5,
        textAlign: 'right',
    },
    authButton: {
        backgroundColor: constats.colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    authLogoBox: {
        width: constats.sizes.logoBox.width,
        height: constats.sizes.logoBox.height,
        backgroundColor: constats.colors.primary,
        borderRadius: 8,
    },
    modal: {
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        centeredView: {
            flex: 1,
            width: '100%',
        },
        scrollViewContent: {
            flexGrow: 0.3,
            justifyContent: 'center',
            alignItems: 'center',
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
            textAlign: 'right',
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
    }
};

export default theme;
