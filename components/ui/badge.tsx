import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

interface BadgeProps extends ViewProps {
  label: string;
  color?: string; // hex color for background
  textColor?: string; // hex color for text
  className?: string;
}

export function Badge({ label, color, textColor = '#fff', className, style, ...props }: BadgeProps) {
  return (
    <View
      className={cn('rounded-full px-2.5 py-0.5 items-center justify-center', className)}
      style={[color ? { backgroundColor: color } : undefined, style as any]}
      {...props}
    >
      <Text className="text-xs font-semibold" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}
