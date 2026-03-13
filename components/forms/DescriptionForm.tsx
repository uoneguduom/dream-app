import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Toggle, ToggleIcon } from '../ui/toggle';
import React from 'react';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export default function DescriptionForm({
  onNext,
}: {
  onNext: (data: { description: string; isNightmare: boolean }) => void;
}) {
  const [description, setDescription] = React.useState('');
  const [isNightmare, setIsNightmare] = React.useState(false);

  return (
    <Card className="mt-32 w-11/12">
      <CardHeader>
        <Text>Décrivez votre rêve</Text>
      </CardHeader>
      <Separator />
      <CardContent className="gap-3">
        <View>
          <Text>De quoi avez vous rêver ?</Text>
          <Textarea placeholder="Ecrivez ici" value={description} onChangeText={setDescription} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="">Etais-ce un cauchemar ?</Text>
          <Toggle pressed={isNightmare} onPressedChange={setIsNightmare}>
            <ToggleIcon as={Check} />
          </Toggle>
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ description, isNightmare })}>
          <Text>Suivant</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
