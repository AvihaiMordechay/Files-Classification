import { useFontScale } from "../context/AccessibilityContext";

export const useConstats = () => {
    const { scaleFactor } = useFontScale();
    return getConstats(scaleFactor);
};


const getConstats = (scaleFactor = 0) => ({
    colors: {
        primary: '#00C7BE',
        white: '#ffffff',
        backgroundButton: '#ECECEC',
        backgroundInput: '#F1F5F9',
        background: '#F9FAFB',
        danger: '#EF4444',
        success: '#10B981',
        starIcon: '#C0C1B8FF'
    },
    sizes: {
        font: {
            small: 12 + scaleFactor,
            medium: 16 + scaleFactor,
            mediumPlus: 20 + scaleFactor,
            large: 24 + scaleFactor,
            xl: 32 + scaleFactor,
        },
        button: {
            width: 120,
            height: 140
        },
        logoBox: {
            width: 50,
            height: 50,
        },
        icon: {
            folderButton: 50,
            fileButton: 50,
            star: 22,
            default: 24,
            FileUploadModal: 42,
            profile: 47
        }
    }
});
