// components/LastDetectionTime.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LastDetectionTimeProps {
  timestamp: string | null;
}

export const LastDetectionTime: React.FC<LastDetectionTimeProps> = ({ timestamp }) => {
  if (!timestamp) return null;

  return (
    <View className="bg-white/10 rounded-2xl p-5 mt-6 backdrop-blur-sm">
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="clock-outline" size={20} color="rgba(255,255,255,0.7)" />
        <Text className="text-white/70 text-sm ml-2 font-medium">
          ตรวจพบครั้งล่าสุด
        </Text>
      </View>
      <Text className="text-white text-lg font-semibold">
        {timestamp}
      </Text>
    </View>
  );
};
