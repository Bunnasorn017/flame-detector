// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, Switch } from 'react-native';

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-xl p-4 mb-4">
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-gray-800">Notifications</Text>
          <Switch value={true} />
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-gray-800">Vibration</Text>
          <Switch value={true} />
        </View>
      </View>
    </View>
  );
}