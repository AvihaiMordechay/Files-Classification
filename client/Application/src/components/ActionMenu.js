import React from 'react';
import { SafeAreaView, StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, withDelay, withTiming, interpolate } from 'react-native-reanimated';
import constats from '../styles/constats';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OFFSET = 60;

const FloatingActionButton = ({ isExpanded, index, labal, icon }) => {
    const animatedStyles = useAnimatedStyle(() => {
        const moveValue = isExpanded.value ? OFFSET * index : 0;
        const translateValue = withSpring(-moveValue, { duration: 1200, overshootClamping: true, dampingRatio: 0.8 });
        const delay = index * 100;
        const scaleValue = isExpanded.value ? 1 : 0;

        return {
            transform: [
                { translateY: translateValue },
                { scale: withDelay(delay, withTiming(scaleValue)) },
            ],
        };
    });

    return (
        <Animated.View style={[animatedStyles, { position: 'absolute' }]}>
            <View style={styles.buttonView}>
                <Animated.Text style={styles.labal}>{labal}</Animated.Text>
                <AnimatedPressable style={[styles.button, styles.shadow]}>
                    <Animated.Text style={[styles.content]}>
                        <Ionicons name={icon} size={28} />
                    </Animated.Text>
                </AnimatedPressable>
            </View>
        </Animated.View>
    );
};

const ActionMenu = () => {
    const isExpanded = useSharedValue(false);

    const handlePress = () => {
        isExpanded.value = !isExpanded.value;
    };

    const plusIconStyle = useAnimatedStyle(() => {
        const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
        const translateValue = withTiming(moveValue);
        const rotateValue = isExpanded.value ? '45deg' : '0deg';

        return {
            transform: [
                { translateX: translateValue },
                { rotate: withTiming(rotateValue) },
            ],
        };
    });
    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={styles.buttonContainer}>
                    <AnimatedPressable
                        onPress={handlePress}
                        style={[styles.shadow, mainButtonStyles.button]}>
                        <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
                            +
                        </Animated.Text>
                    </AnimatedPressable>

                    <FloatingActionButton
                        isExpanded={isExpanded}
                        index={1}
                        labal={'צור תיקייה'}
                        icon={'folder-outline'}
                    />

                    <FloatingActionButton
                        isExpanded={isExpanded}
                        index={2}
                        labal={'העלה קובץ מהקבצים'}
                        icon={'cloud-upload-outline'}
                    />

                    <FloatingActionButton
                        isExpanded={isExpanded}
                        index={3}
                        labal={'העלה קובץ מהגלרייה'}
                        icon={'cloud-upload-outline'}
                    />

                </View>
            </View>
        </SafeAreaView>
    );
};

const mainButtonStyles = StyleSheet.create({
    button: {
        zIndex: 1,
        height: 70,
        width: 70,
        borderRadius: 100,
        backgroundColor: constats.colors.primary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        fontSize: 50,
        color: '#f8f9ff',
    },
});

const styles = StyleSheet.create({
    mainContainer: {
        position: 'relative',
        height: 50,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: '#FDFEFFFF',
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        zIndex: -2,
    },
    buttonView: {
        marginLeft: -70,
        flexDirection: 'row',
        alignItems: 'center'
    },
    labal: {
        marginRight: 6,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#595959FF'

    },
    buttonContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    shadow: {
        shadowColor: '#313131FF',
        shadowOffset: { width: -0.5, height: 3.5 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    content: {
        color: constats.colors.primary,
        fontWeight: 500,
    },
});

export default ActionMenu;
