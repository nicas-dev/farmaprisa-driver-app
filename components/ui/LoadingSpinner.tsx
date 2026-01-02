import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
}

export default function LoadingSpinner({
    size = 'large',
    color = Colors.light.primary,
}: LoadingSpinnerProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
