import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import { Check } from 'lucide-react-native';

export default function Modifier() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [description, setDescription] = React.useState('');
  const [isNightmare, setIsNightmare] = React.useState(false);
  const [places, setPlaces] = React.useState<string[]>([]);
  const [peoples, setPeoples] = React.useState<string[]>([]);
  const [placeInput, setPlaceInput] = React.useState('');
  const [peopleInput, setPeopleInput] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      const existing = await AsyncStorage.getItem('dreams');
      const dreams = existing ? JSON.parse(existing) : [];
      const dream = dreams.find((d: any) => d.id === id);
      if (dream) {
        setDescription(dream.description ?? '');
        setIsNightmare(dream.isNightmare ?? false);
        setPlaces(dream.places ?? []);
        setPeoples(dream.peoples ?? []);
      }
    };
    load();
  }, [id]);

  const save = async () => {
    const existing = await AsyncStorage.getItem('dreams');
    const dreams = existing ? JSON.parse(existing) : [];
    const updated = dreams.map((d: any) =>
      d.id === id
        ? { ...d, description, isNightmare, places, peoples, keywords: [...places, ...peoples] }
        : d
    );
    await AsyncStorage.setItem('dreams', JSON.stringify(updated));
    router.back();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex-1 items-center gap-6 p-4 mt-8">
        <Card className="w-11/12">
          <CardHeader>
            <Text>Modifier le rêve</Text>
          </CardHeader>
          <Separator />
          <CardContent className="gap-4">
            <View>
              <Text>Description</Text>
              <Textarea placeholder="Ecrivez ici" value={description} onChangeText={setDescription} />
            </View>
            <View className="flex-row items-center justify-between">
              <Text>Cauchemar ?</Text>
              <Toggle pressed={isNightmare} onPressedChange={setIsNightmare}>
                <ToggleIcon as={Check} />
              </Toggle>
            </View>
            <Separator />
            <View>
              <Text>Lieux</Text>
              <Input
                placeholder="Nom du lieu"
                value={placeInput}
                onChangeText={setPlaceInput}
                onSubmitEditing={(e) => {
                  setPlaces([...places, e.nativeEvent.text]);
                  setPlaceInput('');
                }}
              />
              {places.map((place, i) => (
                <View key={i} className="flex-row items-center justify-between px-4 pt-1">
                  <Text>- {place}</Text>
                  <Button variant="ghost" onPress={() => setPlaces(places.filter((_, idx) => idx !== i))}>
                    <Icon as={X} />
                  </Button>
                </View>
              ))}
            </View>
            <Separator />
            <View>
              <Text>Personnes</Text>
              <Input
                placeholder="Nom de la personne"
                value={peopleInput}
                onChangeText={setPeopleInput}
                onSubmitEditing={(e) => {
                  setPeoples([...peoples, e.nativeEvent.text]);
                  setPeopleInput('');
                }}
              />
              {peoples.map((people, i) => (
                <View key={i} className="flex-row items-center justify-between px-4 pt-1">
                  <Text>- {people}</Text>
                  <Button variant="ghost" onPress={() => setPeoples(peoples.filter((_, idx) => idx !== i))}>
                    <Icon as={X} />
                  </Button>
                </View>
              ))}
            </View>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onPress={save}>
              <Text>Enregistrer</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </ScrollView>
  );
}
