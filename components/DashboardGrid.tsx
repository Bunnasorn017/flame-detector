// components/DashboardGrid.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { StatusCard } from './StatusCard';

interface DashboardGridProps {
  isFlameDetected: boolean;
  isPumpActive: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  isFlameDetected,
  isPumpActive
}) => {
  return (
    <View className="flex-1 p-4">
      <MotiView 
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        className="mb-8"
      >
        <Text className="text-white text-2xl font-bold mb-2">
          ระบบตรวจจับเปลวไฟ
        </Text>
        <Text className="text-white/70 text-base">
          ระบบป้องกันอัคคีภัยอัตโนมัติ
        </Text>
      </MotiView>

      <View className="flex-row justify-between flex-wrap gap-4">
        <MotiView
          from={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 200 }}
        >
          <StatusCard
            title="เซนเซอร์"
            value={isFlameDetected ? "ตรวจพบเปลวไฟ!" : "ปกติ"}
            icon="fire-alert"
            type="sensor"
            isActive={isFlameDetected}
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: 50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 400 }}
        >
          <StatusCard
            title="ปั๊มน้ำ"
            value={isPumpActive ? "กำลังทำงาน" : "หยุดทำงาน"}
            icon="water-pump"
            type="pump"
            isActive={isPumpActive}
          />
        </MotiView>
      </View>
    </View>
  );
};