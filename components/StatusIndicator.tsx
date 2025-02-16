// components/StatusIndicator.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';

interface StatusIndicatorProps {
  title: string;
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  icon: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  title,
  isActive,
  activeText,
  inactiveText,
  icon
}) => (
  <MotiView
    animate={{ scale: isActive ? 1.05 : 1 }}
    transition={{ type: 'timing', duration: 300 }}
    className="bg-white/95 rounded-3xl p-6 w-40 shadow-lg"
  >
    <MotiView
      animate={{
        backgroundColor: isActive ? 'rgba(254, 226, 226, 0.9)' : 'rgba(243, 244, 246, 0.9)'
      }}
      className="rounded-2xl w-14 h-14 items-center justify-center mb-4"
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={32}
        color={isActive ? "#dc2626" : "#4b5563"}
      />
    </MotiView>
    <Text className="text-base font-semibold text-gray-800 mb-1">{title}</Text>
    <Text className={`text-sm font-medium ${
      isActive ? 'text-red-600' : 'text-green-600'
    }`}>
      {isActive ? activeText : inactiveText}
    </Text>
  </MotiView>
);