import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Frown, Moon, X } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Screen() {
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Vos rêves' });
      displayAllDreams();
    }, [navigation])
  );

  const [isNightmare, setIsNightmare] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [displayDreams, setDisplayDreams] = React.useState<{ id: string; date: string; description: string; isNightmare: boolean; keywords: string[] }[]>([]);

  const removeDream = async (id) => { 
    const existing = await AsyncStorage.getItem('dreams');

    const dreams = existing ? JSON.parse(existing) : [];
    const updated = dreams.filter((dream) => dream.id !== id);
    await AsyncStorage.setItem('dreams', JSON.stringify(updated));
    setDisplayDreams(updated);
  };

  const displayAllDreams = async () => {
    const existing = await AsyncStorage.getItem('dreams');
    setDisplayDreams(existing ? JSON.parse(existing) : []);
  };

  const dreamFilter = (isNightmare: boolean, input: string) => {
    return displayDreams
      .filter((dream) => !isNightmare || dream.isNightmare)
      .filter((dream) => !input || dream.keywords?.some((k: string) => k.toLowerCase().includes(input.toLowerCase())));
  }
  
  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center gap-8 mt-28">
          <View className='flex-row justify-center item-center gap-1 w-4/6'>
            <Input
              placeholder='Rechercher'
              value={searchInput}
              onChangeText={setSearchInput}
            />
            <Toggle pressed={isNightmare} onPressedChange={setIsNightmare}><ToggleIcon as={Frown}/></Toggle>
          </View>
          <View className='gap-5 w-4/5'>
            {dreamFilter(isNightmare, searchInput).map((dream) => (
              <Card className=''>
                <CardHeader>
                  <Text> {dream.date} </Text>
                </CardHeader>
                <CardContent>
                  <Text> {dream.description} </Text>
                </CardContent>
                <CardFooter className='flex-row justify-between'>
                  <Button variant="ghost" onPress={() => removeDream(dream.id)}>
                    <Icon as={X}/>
                  </Button>
                  <Button onPress={() => router.push({ pathname: '/modifier', params: { id: dream.id } })}>
                    <Text>Modifier</Text>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </View>
      </View>
    </ScrollView>
  );
}
