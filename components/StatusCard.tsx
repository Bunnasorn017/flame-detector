// components/StatusCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

interface StatusCardProps {
  title: string;
  value: string;
  icon: string;
  type: 'sensor' | 'pump';
  isActive: boolean;
}

export const StatusCard = ({ title, value, icon, type, isActive }: StatusCardProps) => {
  const gradientColors = type === 'sensor' 
    ? isActive ? ['#dc2626', '#ef4444'] : ['#1e293b', '#334155']
    : isActive ? ['#0ea5e9', '#38bdf8'] : ['#1e293b', '#334155'];

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <MotiView
        animate={{ scale: isActive ? 1.02 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-40 h-48 rounded-3xl overflow-hidden shadow-xl"
      >
        <LinearGradient
          colors={gradientColors}
          className="w-full h-full p-5"
        >
          <View className="bg-white/20 rounded-2xl w-14 h-14 items-center justify-center mb-4">
            <MaterialCommunityIcons 
              name={icon} 
              size={32}
              color="white"
            />
          </View>

          <Text className="text-white text-lg font-semibold mb-2">
            {title}
          </Text>

          <Text className="text-white/90 text-sm">
            สถานะ
          </Text>
          <Text className="text-white text-base font-bold mt-1">
            {value}
          </Text>
        </LinearGradient>
      </MotiView>
    </TouchableOpacity>
  );
};