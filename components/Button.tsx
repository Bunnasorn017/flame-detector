// components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  variant = 'primary' 
}) => {
  const baseStyle = 'px-6 py-3 rounded-lg';
  const variantStyle = variant === 'primary' 
    ? 'bg-blue-500' 
    : 'bg-gray-200';
  const textStyle = variant === 'primary'
    ? 'text-white'
    : 'text-gray-800';

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`${baseStyle} ${variantStyle}`}
    >
      <Text className={`font-medium ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  );
};