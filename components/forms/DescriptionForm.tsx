import React from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import type { DreamType, DreamTone } from '@/lib/types';
import { DREAM_TYPE_COLORS } from '@/lib/types';

const DREAM_TYPES: { value: DreamType; label: string; emoji: string }[] = [
  { value: 'ordinaire', label: 'Ordinaire', emoji: '💭' },
  { value: 'lucide', label: 'Lucide', emoji: '✨' },
  { value: 'cauchemar', label: 'Cauchemar', emoji: '👹' },
  { value: 'prémonitoire', label: 'Prémonitoire', emoji: '🔮' },
  { value: 'récurrent', label: 'Récurrent', emoji: '🔄' },
];

const TONES: { value: DreamTone; label: string; emoji: string }[] = [
  { value: 'positive', label: 'Positive', emoji: '🌟' },
  { value: 'neutre', label: 'Neutre', emoji: '😶' },
  { value: 'négative', label: 'Négative', emoji: '🌑' },
];

export default function DescriptionForm({
  onNext,
}: {
  onNext: (data: {
    description: string;
    dreamType: DreamType;
    tone: DreamTone;
    date: string;
    time: string;
    isNightmare: boolean;
  }) => void;
}) {
  const [description, setDescription] = React.useState('');
  const [dreamType, setDreamType] = React.useState<DreamType>('ordinaire');
  const [tone, setTone] = React.useState<DreamTone>('neutre');
  const [date, setDate] = React.useState(new Date().toLocaleDateString('fr-FR'));
  const [time, setTime] = React.useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  return (
    <Card className="mt-24 w-11/12">
      <CardHeader>
        <Text variant="large">✍️ Décrivez votre rêve</Text>
        <Text variant="muted">Étape 1 sur 4</Text>
      </CardHeader>
      <Separator />
      <CardContent className="gap-5">
        <View className="gap-1.5">
          <Text variant="small">Description du rêve</Text>
          <Textarea
            placeholder="Que s'est-il passé dans votre rêve ?"
            value={description}
            onChangeText={setDescription}
            numberOfLines={4}
          />
        </View>

        <Separator />

        <View className="gap-2">
          <Text variant="small">Type de rêve</Text>
          <View className="flex-row flex-wrap gap-2">
            {DREAM_TYPES.map((type) => (
              <Pressable
                key={type.value}
                onPress={() => setDreamType(type.value)}
                style={[
                  {
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 2,
                    borderColor: dreamType === type.value ? DREAM_TYPE_COLORS[type.value] : 'transparent',
                    backgroundColor:
                      dreamType === type.value
                        ? DREAM_TYPE_COLORS[type.value] + '22'
                        : undefined,
                  },
                ]}
                className={cn(
                  'border',
                  dreamType !== type.value && 'border-border bg-muted/30'
                )}
              >
                <Text
                  className="text-sm"
                  style={dreamType === type.value ? { color: DREAM_TYPE_COLORS[type.value], fontWeight: '700' } : undefined}
                >
                  {type.emoji} {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text variant="small">Tonalité globale</Text>
          <View className="flex-row gap-2">
            {TONES.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => setTone(t.value)}
                className={cn(
                  'flex-1 rounded-full py-2 border items-center',
                  tone === t.value ? 'bg-primary border-primary' : 'border-border'
                )}
              >
                <Text
                  className={cn('text-sm font-medium', tone === t.value ? 'text-primary-foreground' : 'text-foreground')}
                >
                  {t.emoji} {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Separator />

        <View className="flex-row gap-3">
          <View className="flex-1 gap-1.5">
            <Text variant="small">Date du rêve</Text>
            <Input placeholder="jj/mm/aaaa" value={date} onChangeText={setDate} />
          </View>
          <View className="flex-1 gap-1.5">
            <Text variant="small">Heure</Text>
            <Input placeholder="hh:mm" value={time} onChangeText={setTime} />
          </View>
        </View>
      </CardContent>

      <CardFooter className="justify-end">
        <Button onPress={() => onNext({ description, dreamType, tone, date, time, isNightmare: dreamType === 'cauchemar' })}>
          <Text>Suivant →</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
