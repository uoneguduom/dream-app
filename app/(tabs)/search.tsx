import { Text } from '@/components/ui/text';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function Screen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Rechercher' });
    }, [navigation])
  );

  return (
    <View className="flex-1 items-center justify-center gap-8 p-4">
      <Text>salute les copinou</Text>
    </View>
  );
}
