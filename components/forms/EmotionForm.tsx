import React from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { EMOTIONS } from '@/lib/types';

function EmotionPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text variant="small">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {EMOTIONS.map((em) => (
          <Pressable
            key={em.value}
            onPress={() => onChange(em.value)}
            className={cn(
              'rounded-full px-3 py-1.5 border',
              value === em.value ? 'bg-primary border-primary' : 'border-border'
            )}
          >
            <Text
              className={cn(
                'text-xs',
                value === em.value ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {em.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RatingInput({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  lowLabel?: string;
  highLabel?: string;
}) {
  return (
    <View className="gap-2">
      <Text variant="small">{label}</Text>
      <View className="flex-row gap-2 items-center">
        {lowLabel && <Text variant="muted" className="text-xs w-8">{lowLabel}</Text>}
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => onChange(i)}
            className={cn(
              'flex-1 h-9 rounded-lg border-2 items-center justify-center',
              i <= value ? 'bg-primary border-primary' : 'border-border'
            )}
          >
            <Text
              className={cn(
                'text-sm font-bold',
                i <= value ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {i}
            </Text>
          </Pressable>
        ))}
        {highLabel && <Text variant="muted" className="text-xs w-8 text-right">{highLabel}</Text>}
      </View>
    </View>
  );
}

export default function EmotionForm({
  onNext,
}: {
  onNext: (data: {
    emotionBefore: string;
    emotionAfter: string;
    emotionIntensity: number;
    dreamClarity: number;
    sleepQuality: number;
    personalMeaning: string;
  }) => void;
}) {
  const [emotionBefore, setEmotionBefore] = React.useState('calme');
  const [emotionAfter, setEmotionAfter] = React.useState('calme');
  const [emotionIntensity, setEmotionIntensity] = React.useState(3);
  const [dreamClarity, setDreamClarity] = React.useState(3);
  const [sleepQuality, setSleepQuality] = React.useState(3);
  const [personalMeaning, setPersonalMeaning] = React.useState('');

  return (
    <Card className="mt-24 w-11/12">
      <CardHeader>
        <Text variant="large">💫 Émotions & Ressenti</Text>
        <Text variant="muted">Étape 2 sur 4</Text>
      </CardHeader>
      <Separator />
      <CardContent className="gap-5">
        <EmotionPicker
          label="État émotionnel avant le rêve"
          value={emotionBefore}
          onChange={setEmotionBefore}
        />
        <EmotionPicker
          label="État émotionnel après le rêve"
          value={emotionAfter}
          onChange={setEmotionAfter}
        />

        <Separator />

        <RatingInput
          label="Intensité émotionnelle"
          value={emotionIntensity}
          onChange={setEmotionIntensity}
          lowLabel="Faible"
          highLabel="Fort"
        />
        <RatingInput
          label="Clarté du rêve"
          value={dreamClarity}
          onChange={setDreamClarity}
          lowLabel="Flou"
          highLabel="Net"
        />
        <RatingInput
          label="Qualité du sommeil ressentie"
          value={sleepQuality}
          onChange={setSleepQuality}
          lowLabel="Mauvais"
          highLabel="Excellent"
        />

        <Separator />

        <View className="gap-1.5">
          <Text variant="small">Signification personnelle</Text>
          <Textarea
            placeholder="Qu'est-ce que ce rêve signifie pour vous ?"
            value={personalMeaning}
            onChangeText={setPersonalMeaning}
            numberOfLines={3}
          />
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          onPress={() =>
            onNext({ emotionBefore, emotionAfter, emotionIntensity, dreamClarity, sleepQuality, personalMeaning })
          }
        >
          <Text>Suivant →</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
