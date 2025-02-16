// components/AlertModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  timestamp: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  timestamp
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <BlurView intensity={30} className="flex-1 justify-center items-center p-5">
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 250 }}
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
      >
        <View className="bg-gradient-to-r from-red-500 to-red-600 p-8 items-center">
          <View className="bg-white/20 rounded-2xl p-4 mb-4">
            <MaterialCommunityIcons name="fire-alert" size={56} color="white" />
          </View>
          <Text className="text-white text-3xl font-bold mb-2">ตรวจพบเปลวไฟ!</Text>
          <Text className="text-white/90 text-base">โปรดตรวจสอบพื้นที่โดยรอบ</Text>
        </View>
        
        <View className="p-6 bg-gray-50">
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="clock-outline" size={24} color="#dc2626" />
              <Text className="text-gray-700 ml-2 font-medium">เวลาที่ตรวจพบ</Text>
            </View>
            <Text className="text-gray-900 text-lg font-semibold">{timestamp}</Text>
          </View>
          
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="water-pump" size={24} color="#dc2626" />
              <Text className="text-gray-700 ml-2 font-medium">สถานะระบบ</Text>
            </View>
            <Text className="text-gray-900 text-lg font-semibold">
              ระบบกำลังฉีดน้ำดับเพลิงอัตโนมัติ
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-900 rounded-2xl p-4 items-center shadow-lg"
          >
            <Text className="text-white font-semibold text-lg">รับทราบ</Text>
          </TouchableOpacity>
        </View>
      </MotiView>
    </BlurView>
  </Modal>
);