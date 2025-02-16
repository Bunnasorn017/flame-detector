// components/Header.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';

interface HeaderProps {
  isFlameDetected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isFlameDetected }) => (
  <View className="flex-row items-center mb-8">
    <MotiView
      animate={{
        backgroundColor: isFlameDetected 
          ? 'rgba(239, 68, 68, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)'
      }}
      transition={{ type: 'timing', duration: 300 }}
      className="rounded-2xl p-4"
    >
      <MaterialCommunityIcons 
        name="shield-home" 
        size={40} 
        color={isFlameDetected ? "#ef4444" : "#fff"}
      />
    </MotiView>
    <View className="ml-4 flex-1">
      <Text className="text-2xl font-bold text-white">
        ระบบตรวจจับเปลวไฟ
      </Text>
      <Text className="text-base text-white/70 mt-1">
        ระบบป้องกันอัคคีภัยอัตโนมัติ
      </Text>
    </View>
  </View>
);
