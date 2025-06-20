import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useConstats } from '../styles/constats';
import { useUser } from '../context/UserContext';

const Header = () => {
    const constats = useConstats();
    const { user } = useUser();
    const greeting = user.gender === 'male' ? 'ברוך הבא' : 'ברוכה הבאה';
    const backgroundColor = "#717171FF";

    const firstLetter = user.name ? user.name[0] : '';

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
            width: constats.sizes.icon.profile,
            height: constats.sizes.icon.profile,
            borderRadius: 22.5,
            marginLeft: 10,
        },
        initialCircle: {
            width: constats.sizes.icon.profile,
            height: constats.sizes.icon.profile,
            borderRadius: 22.5,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        initialText: {
            color: 'white',
            fontSize: constats.sizes.font.large,
            fontWeight: 'bold',
        },
        greetingText: {
            fontSize: constats.sizes.font.medium - 3,
            color: '#777',
            fontWeight: 'normal',
            writingDirection: 'rtl',
            textAlign: 'right',
        },
        headerText: {
            fontSize: constats.sizes.font.large,
            fontWeight: 'bold',
            writingDirection: 'rtl',
            textAlign: 'right',
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                {user.imgPath ? (
                    <Image
                        source={user.imgPath}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={[styles.initialCircle, { backgroundColor }]}>
                        <Text style={styles.initialText}>{firstLetter}</Text>
                    </View>
                )}
                <View>
                    <Text style={styles.greetingText}>{greeting}</Text>
                    <Text style={styles.headerText}>{user.name}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};


export default Header;
