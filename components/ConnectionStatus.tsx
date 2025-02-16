// components/ConnectionStatus.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => (
  <MotiView
    animate={{
      backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
    }}
    transition={{ type: 'timing', duration: 300 }}
    className="mb-6 px-5 py-3 rounded-2xl flex-row items-center justify-center backdrop-blur-md"
  >
    <MotiView
      animate={{
        backgroundColor: isConnected ? '#10b981' : '#ef4444'
      }}
      transition={{ type: 'timing', duration: 300 }}
      className="w-2.5 h-2.5 rounded-full mr-3"
    />
    <Text className={`text-sm font-medium ${
      isConnected ? 'text-emerald-500' : 'text-red-500'
    }`}>
      {isConnected ? 'เชื่อมต่อกับระบบแล้ว' : 'ไม่มีการเชื่อมต่อ'}
    </Text>
  </MotiView>
);