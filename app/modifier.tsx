import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  DREAM_TYPE_COLORS,
  EMOTIONS,
  type Dream,
  type DreamType,
  type DreamTone,
} from '@/lib/types';

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

function PillSelect<T extends string>({
  options,
  value,
  onChange,
  colorMap,
}: {
  options: { value: T; label: string; emoji?: string }[];
  value: T;
  onChange: (v: T) => void;
  colorMap?: Record<string, string>;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const color = colorMap?.[opt.value];
        const isActive = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={
              isActive && color
                ? { backgroundColor: color + '22', borderColor: color, borderWidth: 2, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }
                : undefined
            }
            className={cn('rounded-full px-3 py-1.5 border', !isActive && 'border-border bg-muted/30')}
          >
            <Text
              className="text-sm"
              style={isActive && color ? { color, fontWeight: '700' } : undefined}
            >
              {opt.emoji} {opt.label}
            </Text>
          </Pressable>
        );
      })}
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
    <View className="gap-1.5">
      <Text variant="small">{label}</Text>
      <View className="flex-row gap-2 items-center">
        {lowLabel && <Text variant="muted" className="text-xs w-12">{lowLabel}</Text>}
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => onChange(i)}
            className={cn(
              'flex-1 h-9 rounded-lg border-2 items-center justify-center',
              i <= value ? 'bg-primary border-primary' : 'border-border'
            )}
          >
            <Text className={cn('text-sm font-bold', i <= value ? 'text-primary-foreground' : 'text-muted-foreground')}>
              {i}
            </Text>
          </Pressable>
        ))}
        {highLabel && <Text variant="muted" className="text-xs w-12 text-right">{highLabel}</Text>}
      </View>
    </View>
  );
}

function EmotionPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View className="gap-1.5">
      <Text variant="small">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {EMOTIONS.map((em) => (
          <Pressable
            key={em.value}
            onPress={() => onChange(em.value)}
            className={cn('rounded-full px-3 py-1.5 border', value === em.value ? 'bg-primary border-primary' : 'border-border')}
          >
            <Text className={cn('text-xs', value === em.value ? 'text-primary-foreground' : 'text-foreground')}>
              {em.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Modifier() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [description, setDescription] = React.useState('');
  const [dreamType, setDreamType] = React.useState<DreamType>('ordinaire');
  const [tone, setTone] = React.useState<DreamTone>('neutre');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [emotionBefore, setEmotionBefore] = React.useState('calme');
  const [emotionAfter, setEmotionAfter] = React.useState('calme');
  const [emotionIntensity, setEmotionIntensity] = React.useState(3);
  const [dreamClarity, setDreamClarity] = React.useState(3);
  const [sleepQuality, setSleepQuality] = React.useState(3);
  const [personalMeaning, setPersonalMeaning] = React.useState('');
  const [places, setPlaces] = React.useState<string[]>([]);
  const [peoples, setPeoples] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [placeInput, setPlaceInput] = React.useState('');
  const [peopleInput, setPeopleInput] = React.useState('');
  const [tagInput, setTagInput] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      const existing = await AsyncStorage.getItem('dreams');
      const dreams = existing ? JSON.parse(existing) : [];
      const dream: Dream = dreams.find((d: Dream) => d.id === id);
      if (dream) {
        setDescription(dream.description ?? '');
        setDreamType(dream.dreamType ?? (dream.isNightmare ? 'cauchemar' : 'ordinaire'));
        setTone(dream.tone ?? 'neutre');
        setDate(dream.date ?? '');
        setTime(dream.time ?? '');
        setEmotionBefore(dream.emotionBefore ?? 'calme');
        setEmotionAfter(dream.emotionAfter ?? 'calme');
        setEmotionIntensity(dream.emotionIntensity ?? 3);
        setDreamClarity(dream.dreamClarity ?? 3);
        setSleepQuality(dream.sleepQuality ?? 3);
        setPersonalMeaning(dream.personalMeaning ?? '');
        setPlaces(dream.places ?? []);
        setPeoples(dream.peoples ?? []);
        setTags(dream.tags ?? []);
      }
    };
    load();
  }, [id]);

  const save = async () => {
    const existing = await AsyncStorage.getItem('dreams');
    const dreams = existing ? JSON.parse(existing) : [];
    const updated = dreams.map((d: Dream) =>
      d.id === id
        ? {
            ...d,
            description,
            dreamType,
            tone,
            date,
            time,
            emotionBefore,
            emotionAfter,
            emotionIntensity,
            dreamClarity,
            sleepQuality,
            personalMeaning,
            places,
            peoples,
            tags,
            keywords: [...places, ...peoples, ...tags],
            isNightmare: dreamType === 'cauchemar',
          }
        : d
    );
    await AsyncStorage.setItem('dreams', JSON.stringify(updated));
    router.back();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="flex-1 items-center gap-4 p-4 mt-4 pb-10">
        <Card className="w-11/12">
          <CardHeader>
            <Text variant="large">✏️ Modifier le rêve</Text>
          </CardHeader>
          <Separator />
          <CardContent className="gap-5">

            {/* Description */}
            <View className="gap-1.5">
              <Text variant="small">Description</Text>
              <Textarea placeholder="Ecrivez ici" value={description} onChangeText={setDescription} numberOfLines={4} />
            </View>

            <Separator />

            {/* Type */}
            <View className="gap-2">
              <Text variant="small">Type de rêve</Text>
              <PillSelect
                options={DREAM_TYPES}
                value={dreamType}
                onChange={setDreamType}
                colorMap={DREAM_TYPE_COLORS}
              />
            </View>

            {/* Tone */}
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
                    <Text className={cn('text-sm font-medium', tone === t.value ? 'text-primary-foreground' : 'text-foreground')}>
                      {t.emoji} {t.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Date / Time */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1.5">
                <Text variant="small">Date</Text>
                <Input placeholder="jj/mm/aaaa" value={date} onChangeText={setDate} />
              </View>
              <View className="flex-1 gap-1.5">
                <Text variant="small">Heure</Text>
                <Input placeholder="hh:mm" value={time} onChangeText={setTime} />
              </View>
            </View>

            <Separator />

            {/* Emotions */}
            <EmotionPicker label="État émotionnel avant" value={emotionBefore} onChange={setEmotionBefore} />
            <EmotionPicker label="État émotionnel après" value={emotionAfter} onChange={setEmotionAfter} />

            <Separator />

            {/* Ratings */}
            <RatingInput label="Intensité émotionnelle" value={emotionIntensity} onChange={setEmotionIntensity} lowLabel="Faible" highLabel="Fort" />
            <RatingInput label="Clarté du rêve" value={dreamClarity} onChange={setDreamClarity} lowLabel="Flou" highLabel="Net" />
            <RatingInput label="Qualité du sommeil" value={sleepQuality} onChange={setSleepQuality} lowLabel="Mauvais" highLabel="Excellent" />

            {/* Personal meaning */}
            <View className="gap-1.5">
              <Text variant="small">Signification personnelle</Text>
              <Textarea placeholder="Qu'est-ce que ce rêve signifie pour vous ?" value={personalMeaning} onChangeText={setPersonalMeaning} numberOfLines={3} />
            </View>

            <Separator />

            {/* Places */}
            <View className="gap-2">
              <Text variant="small">Lieux</Text>
              <Input
                placeholder="Nom du lieu"
                value={placeInput}
                onChangeText={setPlaceInput}
                onSubmitEditing={(e) => {
                  const v = e.nativeEvent.text.trim();
                  if (v) { setPlaces([...places, v]); setPlaceInput(''); }
                }}
                returnKeyType="done"
              />
              <View className="gap-1">
                {places.map((place, i) => (
                  <View key={i} className="flex-row items-center justify-between px-2 py-0.5 rounded-lg bg-muted/40">
                    <Text className="text-sm">📍 {place}</Text>
                    <Button variant="ghost" onPress={() => setPlaces(places.filter((_, idx) => idx !== i))} className="h-8 w-8 p-0">
                      <Icon as={X} className="size-4" />
                    </Button>
                  </View>
                ))}
              </View>
            </View>

            <Separator />

            {/* Peoples */}
            <View className="gap-2">
              <Text variant="small">Personnages</Text>
              <Input
                placeholder="Nom d'un personnage"
                value={peopleInput}
                onChangeText={setPeopleInput}
                onSubmitEditing={(e) => {
                  const v = e.nativeEvent.text.trim();
                  if (v) { setPeoples([...peoples, v]); setPeopleInput(''); }
                }}
                returnKeyType="done"
              />
              <View className="gap-1">
                {peoples.map((people, i) => (
                  <View key={i} className="flex-row items-center justify-between px-2 py-0.5 rounded-lg bg-muted/40">
                    <Text className="text-sm">👤 {people}</Text>
                    <Button variant="ghost" onPress={() => setPeoples(peoples.filter((_, idx) => idx !== i))} className="h-8 w-8 p-0">
                      <Icon as={X} className="size-4" />
                    </Button>
                  </View>
                ))}
              </View>
            </View>

            <Separator />

            {/* Tags */}
            <View className="gap-2">
              <Text variant="small">Tags / Mots-clés</Text>
              <Input
                placeholder="Ex: forêt, voyage..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={(e) => {
                  const v = e.nativeEvent.text.trim();
                  if (v) { setTags([...tags, v]); setTagInput(''); }
                }}
                returnKeyType="done"
              />
              <View className="flex-row flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <View key={i} className="flex-row items-center gap-1 rounded-full bg-secondary px-3 py-1">
                    <Text className="text-xs text-secondary-foreground"># {tag}</Text>
                    <Button variant="ghost" onPress={() => setTags(tags.filter((_, idx) => idx !== i))} className="h-5 w-5 p-0">
                      <Icon as={X} className="size-3" />
                    </Button>
                  </View>
                ))}
              </View>
            </View>

          </CardContent>
          <CardFooter className="justify-end">
            <Button onPress={save}>
              <Text>Enregistrer ✓</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </ScrollView>
  );
}
