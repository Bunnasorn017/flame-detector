import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Paho from 'paho-mqtt';

// ตั้งค่าการแจ้งเตือน
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (error) {
  console.error('Failed to set notification handler:', error);
  Alert.alert('การตั้งค่าแจ้งเตือนล้มเหลว', 'ไม่สามารถตั้งค่าการแจ้งเตือนได้');
}

// MQTT Configuration
const MQTT_CONFIG = {
  host: 'broker.hivemq.com',
  port: 8000,
  clientId: `flame_detector_${Math.random().toString(16).substr(2, 8)}`,
  topics: {
    status: 'flame_detector/status',
    pumpControl: 'flame_detector/pump/control'
  }
};

const StatusIndicator = ({ title, isActive, activeText, inactiveText, icon }:any) => (
  <View className="items-center p-4">
    <MaterialCommunityIcons 
      name={icon} 
      size={30} 
      color={isActive ? "#ff4444" : "#666"}
    />
    <Text className="text-base font-medium mt-2 text-gray-600">{title}</Text>
    <Text className={`text-sm mt-1 font-medium ${isActive ? 'text-red-500' : 'text-green-600'}`}>
      {isActive ? activeText : inactiveText}
    </Text>
  </View>
);

export default function App() {
  const [isFlameDetected, setIsFlameDetected] = useState(false);
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);
  const [mqttClient, setMqttClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // MQTT Connection Setup
  const setupMQTT = useCallback(() => {
    try {
      const client = new Paho.Client(
        MQTT_CONFIG.host,
        MQTT_CONFIG.port,
        MQTT_CONFIG.clientId
      );

      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      client.connect({
        onSuccess: () => {
          try {
            console.log('MQTT Connected');
            setIsConnected(true);
            setReconnectAttempts(0);
            
            // Subscribe to topics with error handling
            client.subscribe(MQTT_CONFIG.topics.status, {
              onSuccess: () => console.log('Subscribed to status topic'),
              onFailure: (err:unknown) => console.error('Failed to subscribe to status topic:', err)
            });
            
            client.subscribe(MQTT_CONFIG.topics.pumpControl, {
              onSuccess: () => console.log('Subscribed to pump control topic'),
              onFailure: (err:unknown) => console.error('Failed to subscribe to pump control topic:', err)
            });
          } catch (error) {
            console.error('Error in connection success handler:', error);
            Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการตั้งค่าการเชื่อมต่อ');
          }
        },
        onFailure: (err:unknown) => {
          console.error('MQTT Connection failed:', err);
          Alert.alert('การเชื่อมต่อล้มเหลว', 'ไม่สามารถเชื่อมต่อกับ MQTT broker ได้');
          handleReconnect();
        },
        useSSL: false
      });

      setMqttClient(client);
    } catch (error) {
      console.error('MQTT Setup error:', error);
      Alert.alert('ข้อผิดพลาดการตั้งค่า', 'ไม่สามารถตั้งค่า MQTT client ได้');
      handleReconnect();
    }
  }, []);

  // Reconnection Handler
  const handleReconnect = useCallback(() => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setReconnectAttempts(prev => prev + 1);
      setTimeout(setupMQTT, 5000 * (reconnectAttempts + 1)); // Exponential backoff
    } else {
      Alert.alert(
        'การเชื่อมต่อล้มเหลว',
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้หลังจากพยายามหลายครั้ง โปรดตรวจสอบการเชื่อมต่อของคุณ',
        [
          {
            text: 'ลองอีกครั้ง',
            onPress: () => {
              setReconnectAttempts(0);
              setupMQTT();
            }
          }
        ]
      );
    }
  }, [reconnectAttempts, setupMQTT]);

  // Connection Lost Handler
  const onConnectionLost = useCallback((responseObject:unknown) => {
    if (responseObject.errorCode !== 0) {
      console.log("Connection lost:", responseObject.errorMessage);
      setIsConnected(false);
      handleReconnect();
    }
  }, [handleReconnect]);

  // Message Arrived Handler
  const onMessageArrived = useCallback((message:unknown) => {
    try {
      const payload = JSON.parse(message.payloadString);
      
      if (message.destinationName === MQTT_CONFIG.topics.status) {
        setIsFlameDetected(payload.flame_detected);
        if (payload.flame_detected) {
          setLastDetectionTime(new Date().toLocaleString());
          sendNotification().catch(error => {
            console.error('Failed to send notification:', error);
          });
        }
        setIsPumpActive(payload.flame_detected);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการประมวลผลข้อความ');
    }
  }, []);

  // Send MQTT Message
  const publishMessage = useCallback((topic, message) => {
    if (!mqttClient || !isConnected) {
      Alert.alert('ไม่สามารถส่งข้อความได้', 'ไม่มีการเชื่อมต่อกับเซิร์ฟเวอร์');
      return;
    }

    try {
      const mqttMessage = new Paho.Message(JSON.stringify(message));
      mqttMessage.destinationName = topic;
      mqttClient.send(mqttMessage);
    } catch (error) {
      console.error('Error publishing message:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถส่งข้อความไปยังเซิร์ฟเวอร์ได้');
    }
  }, [mqttClient, isConnected]);

  useEffect(() => {
    setupMQTT();
    
    const setupNotifications = async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.error('Failed to setup notifications:', error);
        Alert.alert('การแจ้งเตือนล้มเหลว', 'ไม่สามารถตั้งค่าการแจ้งเตือนได้');
      }
    };
    
    setupNotifications();
    
    return () => {
      try {
        if (mqttClient && isConnected) {
          mqttClient.disconnect();
        }
      } catch (error) {
        console.error('Error disconnecting MQTT:', error);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถขอสิทธิ์การแจ้งเตือนได้');
      throw error;
    }
  };

  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ ตรวจพบเปลวไฟ!',
          body: 'ระบบกำลังทำการฉีดน้ำดับเพลิงอัตโนมัติ',
          data: { data: 'goes here' },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('การแจ้งเตือนล้มเหลว', 'ไม่สามารถส่งการแจ้งเตือนได้');
      throw error;
    }
  };

  const handleTestSystem = useCallback(() => {
    try {
      publishMessage(MQTT_CONFIG.topics.status, {
        flame_detected: true,
        timestamp: new Date().getTime()
      });
    } catch (error) {
      console.error('Error testing system:', error);
      Alert.alert('การทดสอบล้มเหลว', 'ไม่สามารถทดสอบระบบได้');
    }
  }, [publishMessage]);

  return (
    <View className="flex-1 bg-gray-100 p-5 pt-16">
      <View className={`mb-4 px-4 py-2 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`text-sm ${isConnected ? 'text-green-800' : 'text-red-800'}`}>
          {isConnected ? 'เชื่อมต่อกับระบบแล้ว' : 'ไม่มีการเชื่อมต่อ'}
        </Text>
      </View>

      <View className="bg-white rounded-2xl shadow-lg p-6">
        <View className="flex-row items-center mb-6">
          <MaterialCommunityIcons 
            name="fire-alert" 
            size={40} 
            color={isFlameDetected ? "#ff4444" : "#666"}
          />
          <Text className="text-2xl font-bold text-gray-800 ml-3">
            ระบบตรวจจับเปลวไฟอัตโนมัติ
          </Text>
        </View>

        <View className="flex-row justify-around mt-2">
          <StatusIndicator
            title="สถานะเซนเซอร์"
            isActive={isFlameDetected}
            activeText="ตรวจพบเปลวไฟ!"
            inactiveText="ปกติ"
            icon="fire"
          />

          <StatusIndicator
            title="สถานะปั๊มน้ำ"
            isActive={isPumpActive}
            activeText="กำลังทำงาน"
            inactiveText="หยุดทำงาน"
            icon="water-pump"
          />
        </View>

        {lastDetectionTime && (
          <Text className="mt-6 text-center text-gray-600 text-sm">
            ตรวจพบครั้งล่าสุด: {lastDetectionTime}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        className="bg-blue-500 p-4 rounded-xl mt-5 items-center"
        onPress={handleTestSystem}
      >
        <Text className="text-white text-base font-medium">
          ทดสอบระบบ
        </Text>
      </TouchableOpacity>
    </View>
  );
}