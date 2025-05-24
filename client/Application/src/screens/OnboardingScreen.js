import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import constats from '../styles/constats';
import { useNavigation } from '@react-navigation/native';

const onboardingPages = [
    {
        id: 1,
        title: 'ברוכים הבאים\nלאפליקציה לניהול מסמכים',
        startText: 'בואו נתחיל!'
    },
    {
        id: 2,
        title: 'על האפליקציה',
        startText: 'הרשמו עכשיו'
    }
];

const OnboardingScreen = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const navigation = useNavigation();
    const page = onboardingPages[pageIndex];

    const setPage = () => {
        if (pageIndex === 0) {
            setPageIndex(1);
        } else {
            navigation.navigate('Registration');
        }
    };

    const renderDescription = () => {
        if (page.id === 1) {
            return (
                <Text style={styles.description}>
                    הפכו את ניהול הקבצים שלכם לפשוט, מהיר ויעיל.{"\n"}
                    כל המסמכים במקום אחד ובנגישות מלאה.
                </Text>
            );
        } else if (page.id === 2) {
            return (
                <Text style={styles.description}>
                    האפליקציה שלנו מאפשרת לכם לאחסן קבצים ותמונות בצורה חכמה באמצעות עיבוד תמונה.{"\n"}
                    יצרנו ממשק פשוט ונוח שמאפשר למצוא מסמכים חשובים במהירות ובקלות.{"\n\n"}
                    כשתעלו קובץ, האפליקציה תזהה באופן אוטומטי אחת מארבעת הקטגוריות:{"\n"}
                    <Text style={styles.bold}>תחבורה, פיננסי, השכלה או רפואה.</Text>{"\n\n"}
                    תוכלו גם לבחור בעצמכם איך לארגן את התיקיות שלכם, כדי שניהול המסמכים יתאים בדיוק לצרכים שלכם.
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{page.title}</Text>
                {renderDescription()}
            </View>

            <View style={styles.dotsContainer}>
                {[...onboardingPages].reverse().map((_, i) => {
                    const actualIndex = onboardingPages.length - 1 - i;
                    return (
                        <View
                            key={i}
                            style={[styles.dot, pageIndex === actualIndex && styles.activeDot]}
                        />
                    );
                })}
            </View>

            {page.startText && (
                <TouchableOpacity style={styles.startButton} onPress={setPage}>
                    <Text style={styles.startButtonText}>{page.startText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constats.colors.white,
        padding: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        direction: 'rtl',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: constats.sizes.font.large + 3,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20
    },
    description: {
        fontSize: constats.sizes.font.medium + 1,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24
    },
    bold: {
        fontWeight: 'bold',
        color: '#000'
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc'
    },
    activeDot: {
        backgroundColor: constats.colors.primary,
        width: 16
    },
    startButton: {
        backgroundColor: constats.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 36,
        marginBottom: 32
    },
    startButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: constats.sizes.font.medium
    }
});
