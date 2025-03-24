import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import constats from '../../styles/constats';

const settingsOptions = [
    { id: '1', title: 'הגדרות משתמש', screen: 'UserSettings', icon: 'person-outline' },
    { id: '2', title: 'נגישות', screen: 'NotificationsSettings', icon: 'accessibility-outline' },
];

const SettingsScreen = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.screen)}>
            <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
            <Text style={styles.text}>{item.title}</Text>
            <Ionicons name="chevron-back" size={20} color="#777" style={styles.chevron} />
        </TouchableOpacity>
    );

    return (
        <View >
            <Header />
            <Text style={styles.title}>הגדרות</Text>
            <FlatList
                data={settingsOptions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                style={styles.listTable}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listTable: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: constats.sizes.font.large,
        fontWeight: 'bold',
        textAlign: 'right',
        marginVertical: 20,
        color: '#333',
        paddingHorizontal: 25,
    },
    list: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',

    },
    item: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    text: {
        fontSize: 18,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    icon: {
        marginLeft: 10,
    },
    chevron: {
        marginRight: 10,
    },
});

export default SettingsScreen;
