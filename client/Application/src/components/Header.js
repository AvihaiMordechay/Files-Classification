import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

const Header = ({ name }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://example.com/profile.jpg' }}
                    style={styles.profileImage}
                />
                <Text style={styles.headerText}>{name}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 10 : 10,
        backgroundColor: 'white',
        height: 80,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;
