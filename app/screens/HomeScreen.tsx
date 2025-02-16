// screens/HomeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <Text className="text-xl font-semibold mb-2">System Status</Text>
          <Text className="text-gray-600 mb-4">
            Monitoring for flame detection...
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-green-600 font-medium">Active</Text>
            <Button 
              title="Settings" 
              variant="secondary"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}