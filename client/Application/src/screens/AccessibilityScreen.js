import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFontScale } from "../context/AccessibilityContext";
import { useConstats } from "../styles/constats";
import { changeScaleFactor } from "../services/database";

const AccessibilityScreen = () => {
    const { scaleFactor, setScaleFactor } = useFontScale();
    const constats = useConstats();

    const options = [
        { label: "רגיל", scale: 0 },
        { label: "בינוני", scale: 2.5 },
        { label: "גדול", scale: 5 },
    ];

    const handleChangeFactor = async (scale) => {
        try {
            await changeScaleFactor(scale);
            setScaleFactor(scale)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontSize: 18 }]}>
                בחר גודל גופן
            </Text>

            <View style={styles.buttonsContainer}>
                {options.map(({ label, scale }) => {
                    const selected = scaleFactor === scale;
                    return (
                        <TouchableOpacity
                            key={label}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: selected
                                        ? constats.colors.primary
                                        : constats.colors.backgroundButton,
                                },
                            ]}
                            onPress={() => handleChangeFactor(scale)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    color: selected ? constats.colors.white : "#333",
                                    fontSize: 16 + scale,
                                    fontWeight: "600",
                                }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    title: {
        marginBottom: 30,
        fontWeight: "bold",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    button: {
        width: 100,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 2,
    },
});

export default AccessibilityScreen;
