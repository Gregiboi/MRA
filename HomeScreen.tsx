import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './../types';
import * as Network from 'expo-network';
import * as Battery from 'expo-battery';
import { Gyroscope, Accelerometer } from 'expo-sensors';
import StorageScreen from './StorageScreen';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        let gyroscopeSubscription: any;
        let accelerometerSubscription: any;

        const subscribeGyroscope = async () => {
            await Gyroscope.isAvailableAsync();
            gyroscopeSubscription = Gyroscope.addListener((data) => {
                setGyroscopeData({ x: data.x, y: data.y, z: data.z });
            });
        };

        const subscribeAccelerometer = async () => {
            await Accelerometer.isAvailableAsync();
            accelerometerSubscription = Accelerometer.addListener((data) => {
                setAccelerometerData({ x: data.x, y: data.y, z: data.z });
            });
        };

        subscribeGyroscope();
        subscribeAccelerometer();

        return () => {
            gyroscopeSubscription && gyroscopeSubscription.remove();
            accelerometerSubscription && accelerometerSubscription.remove();
        };
    }, []);

    const checkBattery = async () => {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        alert(`Battery Level: ${Math.floor(batteryLevel * 100)}%`);
    };

    const checkWifi = async () => {
        const networkState = await Network.getNetworkStateAsync();
        alert(`Connected to Wi-Fi: ${networkState.isConnected}`);
    };

    const showGyroscope = () => {
        alert(`Gyroscope: x=${gyroscopeData.x.toFixed(2)}, y=${gyroscopeData.y.toFixed(2)}, z=${gyroscopeData.z.toFixed(2)}`);
    };

    const showAccelerometer = () => {
        alert(`Accelerometer: x=${accelerometerData.x.toFixed(2)}, y=${accelerometerData.y.toFixed(2)}, z=${accelerometerData.z.toFixed(2)}`);
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Vibration', { duration: 1000 })}>
                <Text style={styles.buttonText}>Test Vibration</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Color')}>
                <Text style={styles.buttonText}>Check Color</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Camera')}>
                <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={checkBattery}>
                <Text style={styles.buttonText}>Check Battery</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={checkWifi}>
                <Text style={styles.buttonText}>Check Wi-Fi</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={showGyroscope}>
                <Text style={styles.buttonText}>Show Gyroscope</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={showAccelerometer}>
                <Text style={styles.buttonText}>Show Gravity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Storage')}>
                <Text style={styles.buttonText}>Go to Storage Screen</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#008CBA',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '90%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textTransform: 'uppercase',
    },
});

export default HomeScreen;