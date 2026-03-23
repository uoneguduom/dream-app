import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { View } from 'react-native';
import { Icon } from '../ui/icon';
import { X } from 'lucide-react-native';
import { Button } from '../ui/button';

export default function PlacesForm({ onNext }: { onNext: (data: { places: string[] }) => void }) {
  const [places, setPlaces] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const addPlace = (place: string) => {
    const trimmed = place.trim();
    if (trimmed) setPlaces([...places, trimmed]);
  };

  const removePlace = (i: number) => {
    setPlaces(places.filter((_, idx) => idx !== i));
  };

  return (
    <Card className="mt-24 w-11/12">
      <CardHeader>
        <Text variant="large">📍 Lieux du rêve</Text>
        <Text variant="muted">Étape 3 sur 4</Text>
      </CardHeader>

      <Separator />

      <CardContent className="gap-2">
        <Text variant="small">Ajouter les lieux de votre rêve</Text>
        <Input
          placeholder="Nom du lieu"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(e) => {
            addPlace(e.nativeEvent.text);
            setInputValue('');
          }}
          returnKeyType="done"
        />
        <View className="gap-1 pt-1">
          {places.map((place, index) => (
            <View key={index} className="flex-row items-center justify-between px-2 py-0.5 rounded-lg bg-muted/40">
              <Text className="text-sm">📍 {place}</Text>
              <Button variant="ghost" onPress={() => removePlace(index)} className="h-8 w-8 p-0">
                <Icon as={X} className="size-4" />
              </Button>
            </View>
          ))}
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ places })}>
          <Text>Suivant →</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
