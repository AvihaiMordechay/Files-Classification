import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

const Header = ({ user }) => {
    const greeting = user.gender === 'male' ? 'ברוך הבא' : 'ברוכה הבאה';
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Image
                    source={user.imgPath}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.greetingText}>{greeting}</Text>
                    <Text style={styles.headerText}>{user.name}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 10 : 10,
        backgroundColor: 'white',
        height: 90,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 10,
    },
    greetingText: {
        fontSize: 14,
        color: '#777',
        fontWeight: 'normal',
        writingDirection: 'rtl',
        textAlign: 'right',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        writingDirection: 'rtl',
        textAlign: 'right',
    },
});

export default Header;
