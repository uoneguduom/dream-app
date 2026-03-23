import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Icon } from '../ui/icon';
import { X } from 'lucide-react-native';
import { Button } from '../ui/button';

export default function PeoplesForm({
  onNext,
}: {
  onNext: (data: { peoples: string[]; tags: string[] }) => void;
}) {
  const [peoples, setPeoples] = React.useState<string[]>([]);
  const [peopleInput, setPeopleInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const addPeople = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) setPeoples([...peoples, trimmed]);
  };

  const removePeople = (i: number) => {
    setPeoples(peoples.filter((_, idx) => idx !== i));
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed) setTags([...tags, trimmed]);
  };

  const removeTag = (i: number) => {
    setTags(tags.filter((_, idx) => idx !== i));
  };

  return (
    <Card className="mt-24 w-11/12">
      <CardHeader>
        <Text variant="large">👥 Personnages & Tags</Text>
        <Text variant="muted">Étape 4 sur 4</Text>
      </CardHeader>

      <Separator />

      <CardContent className="gap-5">
        <View className="gap-2">
          <Text variant="small">Personnages présents dans le rêve</Text>
          <Input
            placeholder="Nom d'un personnage"
            value={peopleInput}
            onChangeText={setPeopleInput}
            onSubmitEditing={(e) => {
              addPeople(e.nativeEvent.text);
              setPeopleInput('');
            }}
            returnKeyType="done"
          />
          <View className="gap-1">
            {peoples.map((people, index) => (
              <View key={index} className="flex-row items-center justify-between px-2 py-0.5 rounded-lg bg-muted/40">
                <Text className="text-sm">👤 {people}</Text>
                <Button variant="ghost" onPress={() => removePeople(index)} className="h-8 w-8 p-0">
                  <Icon as={X} className="size-4" />
                </Button>
              </View>
            ))}
          </View>
        </View>

        <Separator />

        <View className="gap-2">
          <Text variant="small">Tags / Mots-clés</Text>
          <Input
            placeholder="Ex: forêt, voyage, maison..."
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={(e) => {
              addTag(e.nativeEvent.text);
              setTagInput('');
            }}
            returnKeyType="done"
          />
          <View className="flex-row flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <View key={index} className="flex-row items-center gap-1 rounded-full bg-secondary px-3 py-1">
                <Text className="text-xs text-secondary-foreground"># {tag}</Text>
                <Button variant="ghost" onPress={() => removeTag(index)} className="h-5 w-5 p-0">
                  <Icon as={X} className="size-3" />
                </Button>
              </View>
            ))}
          </View>
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ peoples, tags })}>
          <Text>Enregistrer ✓</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
