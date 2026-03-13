import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { View } from 'react-native';
import { Icon } from '../ui/icon';
import { Cross, X } from 'lucide-react-native';
import { Button } from '../ui/button';

export default function PeoplesForm({ onNext }: { onNext: (data: { peoples: string[] }) => void }) {
  const [peoples, setPeoples] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const addPeople = (people) => {
    return setPeoples([...peoples, people]);
  };

  const removePeople = (i) => {
    setPeoples(peoples.filter((_, idx) => idx !== i));
  };

  return (
    <Card className="mt-5 w-11/12">
      <CardHeader>
        <Text>Qui était présent dans votre rêve</Text>
      </CardHeader>

      <Separator />

      <CardContent className="">
        <Text>Ajouter les personnes de votre rêve</Text>
        <Input
          placeholder="Nom de la personne"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(e) => {
            addPeople(e.nativeEvent.text);
            setInputValue('');
          }}
        />
        <View className="pt-5">
          {peoples.map((people, index) => (
            <View className="flex-row items-center justify-between px-10">
              <Text key={index}> - {people}</Text>
              <Button variant="ghost" onPress={() => removePeople(index)}>
                <Icon as={X} />
              </Button>
            </View>
          ))}
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ peoples })}>
          <Text>Suivant</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
