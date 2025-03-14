import { Platform } from 'react-native';
import constats from "./constats";

const theme = {
    inputContainer: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: Platform.select({ ios: 15, android: 8 }), // שינוי דינמי
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
};

export default theme;
