import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import {VibrationScreen} from './screens/VibrationScreen';
import {ColorScreen} from './screens/ColorScreen';
import {CameraScreen} from './screens/CameraScreen';
import { RootStackParamList } from './types';
import StorageScreen from './screens/StorageScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Vibration" component={VibrationScreen} />
          <Stack.Screen name="Color" component={ColorScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Storage" component={StorageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}