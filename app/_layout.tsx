// _layout.tsx
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Paho from 'paho-mqtt';
import "../global";

import HomeScreen from '../app/screens/HomeScreen';
import SettingsScreen from '../app/screens/SettingScreen';
import { AlertModal } from '../components/AlertModal';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// MQTT configuration
const MQTT_HOST = 'broker.hivemq.com';
const MQTT_PORT = 8000; // WebSocket port
const MQTT_TOPIC = 'flame-detector/status';
const CLIENT_ID = `flame_detector_${Math.random().toString(16).substr(2, 8)}`;

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {
  const [isFlameDetected, setIsFlameDetected] = useState(false);
  const [client, setClient] = useState<Paho.Client | null>(null);

  useEffect(() => {
    // Create MQTT client
    const mqttClient = new Paho.Client(MQTT_HOST, MQTT_PORT, CLIENT_ID);

    // Set callback handlers
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    // Connect to broker
    mqttClient.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        mqttClient.subscribe(MQTT_TOPIC);
      },
      onFailure: (err) => {
        console.error('Failed to connect to MQTT broker:', err);
      },
      useSSL: true,
    });

    setClient(mqttClient);

    // Cleanup on unmount
    return () => {
      if (mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  const onConnectionLost = (responseObject: Paho.MQTTError) => {
    if (responseObject.errorCode !== 0) {
      console.log('Connection lost:', responseObject.errorMessage);
    }
  };

  const onMessageArrived = (message: Paho.Message) => {
    try {
      const data = JSON.parse(message.payloadString);
      if (data.flame_detected) {
        setIsFlameDetected(true);
        sendNotification();
      } else {
        setIsFlameDetected(false);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Fire Alert!",
        body: "Flame detected! The water pump has been activated.",
        data: { data: 'goes here' },
      },
      trigger: null,
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Flame Detector' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <AlertModal 
        visible={isFlameDetected} 
        onClose={() => setIsFlameDetected(false)}
      />
    </SafeAreaProvider>
  );
}