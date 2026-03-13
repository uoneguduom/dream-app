import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { View } from 'react-native';
import { Icon } from '../ui/icon';
import { Cross, X } from 'lucide-react-native';
import { Button } from '../ui/button';

export default function PlacesForm({ onNext }: { onNext: (data: { places: string[] }) => void }) {
  const [places, setPlaces] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const addPlace = (place) => {
    return setPlaces([...places, place]);
  };
  const removePlace = (i) => {
    setPlaces(places.filter((_, idx) => idx !== i));
  };

  return (
    <Card className="mt-5 w-11/12">
      <CardHeader>
        <Text>Ou prenait place votre rêve ?</Text>
      </CardHeader>

      <Separator />

      <CardContent className="">
        <Text>Ajouter les lieux de votre rêve</Text>
        <Input
          placeholder="Nom du lieu"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(e) => {
            addPlace(e.nativeEvent.text);
            setInputValue('');
          }}
        />
        <View className="pt-5">
          {places.map((place, index) => (
            <View className="flex-row items-center justify-between px-10">
              <Text key={index}> - {place}</Text>
              <Button variant="ghost" onPress={() => removePlace(index)}>
                <Icon as={X} />
              </Button>
            </View>
          ))}
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ places })}>
          <Text>Suivant</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
