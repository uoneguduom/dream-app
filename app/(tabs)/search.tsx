import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { X, Pencil, Trash2, MoonStar } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DREAM_TYPE_COLORS,
  DREAM_TYPE_LABELS,
  TONE_COLORS,
  TONE_EMOJIS,
  type Dream,
  type DreamType,
  type DreamTone,
} from '@/lib/types';
import { cn } from '@/lib/utils';

const TYPE_FILTERS: { value: DreamType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'ordinaire', label: '💭 Ordinaire' },
  { value: 'lucide', label: '✨ Lucide' },
  { value: 'cauchemar', label: '👹 Cauchemar' },
  { value: 'prémonitoire', label: '🔮 Prémonitoire' },
  { value: 'récurrent', label: '🔄 Récurrent' },
];

const TONE_FILTERS: { value: DreamTone | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'positive', label: '🌟 Positive' },
  { value: 'neutre', label: '😶 Neutre' },
  { value: 'négative', label: '🌑 Négative' },
];

function RatingDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < value ? 'bg-primary' : 'bg-border'}`}
        />
      ))}
    </View>
  );
}

export default function Screen() {
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Vos rêves' });
      displayAllDreams();
    }, [navigation])
  );

  const [searchInput, setSearchInput] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<DreamType | 'all'>('all');
  const [toneFilter, setToneFilter] = React.useState<DreamTone | 'all'>('all');
  const [displayDreams, setDisplayDreams] = React.useState<Dream[]>([]);

  const removeDream = async (id: string) => {
    const existing = await AsyncStorage.getItem('dreams');
    const dreams = existing ? JSON.parse(existing) : [];
    const updated = dreams.filter((d: Dream) => d.id !== id);
    await AsyncStorage.setItem('dreams', JSON.stringify(updated));
    setDisplayDreams(updated);
  };

  const displayAllDreams = async () => {
    const existing = await AsyncStorage.getItem('dreams');
    setDisplayDreams(existing ? JSON.parse(existing) : []);
  };

  const filtered = displayDreams
    .filter((d) => typeFilter === 'all' || d.dreamType === typeFilter || (typeFilter === 'cauchemar' && d.isNightmare && !d.dreamType))
    .filter((d) => toneFilter === 'all' || d.tone === toneFilter)
    .filter((d) => {
      if (!searchInput) return true;
      const q = searchInput.toLowerCase();
      return (
        d.description?.toLowerCase().includes(q) ||
        d.keywords?.some((k) => k.toLowerCase().includes(q)) ||
        d.tags?.some((t) => t.toLowerCase().includes(q)) ||
        d.peoples?.some((p) => p.toLowerCase().includes(q)) ||
        d.places?.some((p) => p.toLowerCase().includes(q)) ||
        d.emotionBefore?.toLowerCase().includes(q) ||
        d.emotionAfter?.toLowerCase().includes(q)
      );
    })
    .reverse();

  return (
    <ScrollView>
      <View className="flex-1 items-center gap-5 mt-28 pb-10">
        {/* Search bar */}
        <View className="w-11/12 flex-row items-center gap-2">
          <View className="flex-1 relative">
            <Input
              placeholder="Rechercher un rêve..."
              value={searchInput}
              onChangeText={setSearchInput}
              className="pl-4"
            />
          </View>
          {searchInput.length > 0 && (
            <Button variant="ghost" onPress={() => setSearchInput('')} size="icon">
              <Icon as={X} className="size-4" />
            </Button>
          )}
        </View>

        {/* Type filter chips */}
        <View className="w-11/12 gap-2">
          <Text variant="muted" className="text-xs">Type de rêve</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-2">
              {TYPE_FILTERS.map((f) => {
                const isActive = typeFilter === f.value;
                const color = f.value !== 'all' ? DREAM_TYPE_COLORS[f.value as DreamType] : undefined;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => setTypeFilter(f.value)}
                    style={isActive && color ? { backgroundColor: color + '22', borderColor: color, borderWidth: 2, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 } : undefined}
                    className={cn('rounded-full px-3 py-1.5 border', !isActive && 'border-border bg-muted/30')}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={isActive && color ? { color } : undefined}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Tone filter chips */}
        <View className="w-11/12 gap-2">
          <Text variant="muted" className="text-xs">Tonalité</Text>
          <View className="flex-row gap-2">
            {TONE_FILTERS.map((f) => {
              const isActive = toneFilter === f.value;
              const color = f.value !== 'all' ? TONE_COLORS[f.value as DreamTone] : undefined;
              return (
                <Pressable
                  key={f.value}
                  onPress={() => setToneFilter(f.value)}
                  style={isActive && color ? { backgroundColor: color + '22', borderColor: color, borderWidth: 2, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 } : undefined}
                  className={cn('flex-1 rounded-full px-2 py-1.5 border items-center', !isActive && 'border-border bg-muted/30')}
                >
                  <Text
                    className="text-xs font-medium"
                    style={isActive && color ? { color } : undefined}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Separator className="w-11/12" />

        {/* Results count */}
        <View className="w-11/12 flex-row items-center justify-between">
          <Text variant="muted">{filtered.length} rêve{filtered.length !== 1 ? 's' : ''}</Text>
          {(typeFilter !== 'all' || toneFilter !== 'all' || searchInput) && (
            <Pressable onPress={() => { setTypeFilter('all'); setToneFilter('all'); setSearchInput(''); }}>
              <Text variant="muted" className="text-xs underline">Réinitialiser</Text>
            </Pressable>
          )}
        </View>

        {/* Dream cards */}
        <View className="gap-4 w-11/12">
          {filtered.length === 0 && (
            <View className="items-center py-12 gap-3">
              <Icon as={MoonStar} className="size-12 text-muted-foreground" />
              <Text variant="muted">Aucun rêve trouvé</Text>
            </View>
          )}
          {filtered.map((dream) => {
            const typeColor = dream.dreamType ? DREAM_TYPE_COLORS[dream.dreamType] : '#6b7280';
            const toneColor = dream.tone ? TONE_COLORS[dream.tone] : '#6b7280';
            const toneEmoji = dream.tone ? TONE_EMOJIS[dream.tone] : '😶';
            return (
              <Card
                key={dream.id}
                style={{ borderLeftWidth: 4, borderLeftColor: typeColor }}
                className="overflow-hidden"
              >
                {/* Header */}
                <CardHeader className="pb-0">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text variant="muted" className="text-xs">{dream.date}</Text>
                      {dream.time ? <Text variant="muted" className="text-xs">• {dream.time}</Text> : null}
                    </View>
                    <View className="flex-row items-center gap-2">
                      {dream.dreamType && (
                        <Badge
                          label={DREAM_TYPE_LABELS[dream.dreamType]}
                          color={typeColor}
                        />
                      )}
                      {!dream.dreamType && dream.isNightmare && (
                        <Badge label="Cauchemar" color="#ef4444" />
                      )}
                      <Text style={{ color: toneColor }}>{toneEmoji}</Text>
                    </View>
                  </View>
                </CardHeader>

                {/* Description */}
                <CardContent className="pt-3 gap-3">
                  <Text numberOfLines={3} className="leading-5">
                    {dream.description}
                  </Text>

                  {/* Emotions */}
                  {(dream.emotionBefore || dream.emotionAfter) && (
                    <View className="flex-row gap-2 flex-wrap">
                      {dream.emotionBefore && (
                        <View className="rounded-full bg-muted px-2.5 py-0.5">
                          <Text className="text-xs text-muted-foreground">Avant: {dream.emotionBefore}</Text>
                        </View>
                      )}
                      {dream.emotionAfter && (
                        <View className="rounded-full bg-muted px-2.5 py-0.5">
                          <Text className="text-xs text-muted-foreground">Après: {dream.emotionAfter}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Ratings row */}
                  {(dream.emotionIntensity || dream.dreamClarity || dream.sleepQuality) && (
                    <View className="flex-row gap-4">
                      {dream.emotionIntensity && (
                        <View className="gap-0.5">
                          <Text variant="muted" className="text-xs">Intensité</Text>
                          <RatingDots value={dream.emotionIntensity} />
                        </View>
                      )}
                      {dream.dreamClarity && (
                        <View className="gap-0.5">
                          <Text variant="muted" className="text-xs">Clarté</Text>
                          <RatingDots value={dream.dreamClarity} />
                        </View>
                      )}
                      {dream.sleepQuality && (
                        <View className="gap-0.5">
                          <Text variant="muted" className="text-xs">Sommeil</Text>
                          <RatingDots value={dream.sleepQuality} />
                        </View>
                      )}
                    </View>
                  )}

                  {/* Places & peoples */}
                  {((dream.places?.length ?? 0) > 0 || (dream.peoples?.length ?? 0) > 0) && (
                    <View className="flex-row gap-2 flex-wrap">
                      {dream.places?.map((p, i) => (
                        <View key={i} className="rounded-full border border-border px-2.5 py-0.5">
                          <Text className="text-xs">📍 {p}</Text>
                        </View>
                      ))}
                      {dream.peoples?.map((p, i) => (
                        <View key={i} className="rounded-full border border-border px-2.5 py-0.5">
                          <Text className="text-xs">👤 {p}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Tags */}
                  {(dream.tags?.length ?? 0) > 0 && (
                    <View className="flex-row gap-1.5 flex-wrap">
                      {dream.tags?.map((tag, i) => (
                        <View key={i} className="rounded-full bg-secondary px-2.5 py-0.5">
                          <Text className="text-xs text-secondary-foreground"># {tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </CardContent>

                {/* Footer */}
                <CardFooter className="justify-between pt-0">
                  <Button
                    variant="ghost"
                    onPress={() => removeDream(dream.id)}
                    className="gap-1"
                  >
                    <Icon as={Trash2} className="size-4 text-destructive" />
                    <Text className="text-destructive text-sm">Supprimer</Text>
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => router.push({ pathname: '/modifier', params: { id: dream.id } })}
                    className="gap-1"
                  >
                    <Icon as={Pencil} className="size-4" />
                    <Text className="text-sm">Modifier</Text>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
