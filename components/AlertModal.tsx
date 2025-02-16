// components/AlertModal.tsx
import React, { useEffect } from 'react';
import { Modal, View, Text, Vibration } from 'react-native';
import { Button } from './Button';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      // Vibrate pattern: wait 500ms, vibrate 500ms, wait 500ms, vibrate 500ms
      Vibration.vibrate([500, 500, 500, 500]);
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl p-6 m-4 w-5/6 items-center">
          <Text className="text-red-600 text-2xl font-bold mb-4">
            🔥 Fire Alert! 🔥
          </Text>
          <Text className="text-gray-700 text-center mb-6">
            Flame detected! The water pump has been activated to extinguish the fire.
          </Text>
          <Button onPress={onClose} title="Acknowledge" />
        </View>
      </View>
    </Modal>
  );
};
