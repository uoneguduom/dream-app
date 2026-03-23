import DescriptionForm from '@/components/forms/DescriptionForm';
import PlacesForm from '@/components/forms/PlacesForm';
import PeoplesForm from '@/components/forms/PeoplesForm';
import EmotionForm from '@/components/forms/EmotionForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import uuid from 'react-native-uuid';
import type { Dream } from '@/lib/types';

const STEPS = ['description', 'emotion', 'places', 'peoples'] as const;
type Step = typeof STEPS[number];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <View className="flex-row gap-2 items-center justify-center py-2">
      {STEPS.map((s, i) => (
        <View
          key={s}
          className={`h-2 rounded-full ${i <= idx ? 'bg-primary' : 'bg-border'}`}
          style={{ width: i === idx ? 24 : 8 }}
        />
      ))}
    </View>
  );
}

export default function Screen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Nouveau rêve' });
    }, [navigation])
  );

  const [step, setStep] = React.useState<Step>('description');
  const [dream, setDream] = React.useState<Partial<Dream>>({});

  const saveDream = async (finalDream: Dream) => {
    const existing = await AsyncStorage.getItem('dreams');
    const dreams = existing ? JSON.parse(existing) : [];
    dreams.push(finalDream);
    await AsyncStorage.setItem('dreams', JSON.stringify(dreams));
  };

  const submitDream = (data: { peoples: string[]; tags: string[] }) => {
    const merged = { ...dream, ...data };
    const finalDream: Dream = {
      id: uuid.v4() as string,
      description: merged.description ?? '',
      dreamType: merged.dreamType ?? 'ordinaire',
      tone: merged.tone ?? 'neutre',
      date: merged.date ?? new Date().toLocaleDateString('fr-FR'),
      time: merged.time ?? '',
      emotionBefore: merged.emotionBefore ?? 'calme',
      emotionAfter: merged.emotionAfter ?? 'calme',
      emotionIntensity: merged.emotionIntensity ?? 3,
      dreamClarity: merged.dreamClarity ?? 3,
      sleepQuality: merged.sleepQuality ?? 3,
      personalMeaning: merged.personalMeaning ?? '',
      places: merged.places ?? [],
      peoples: data.peoples,
      tags: data.tags,
      keywords: [
        ...(merged.places ?? []),
        ...data.peoples,
        ...data.tags,
      ],
      isNightmare: merged.dreamType === 'cauchemar',
    };
    saveDream(finalDream);
    setDream({});
    setStep('description');
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="w-screen flex-1 items-center justify-center gap-4 p-4">
        <StepIndicator current={step} />
        {step === 'description' && (
          <DescriptionForm
            onNext={(data) => {
              setDream((prev) => ({ ...prev, ...data }));
              setStep('emotion');
            }}
          />
        )}
        {step === 'emotion' && (
          <EmotionForm
            onNext={(data) => {
              setDream((prev) => ({ ...prev, ...data }));
              setStep('places');
            }}
          />
        )}
        {step === 'places' && (
          <PlacesForm
            onNext={(data) => {
              setDream((prev) => ({ ...prev, ...data }));
              setStep('peoples');
            }}
          />
        )}
        {step === 'peoples' && (
          <PeoplesForm
            onNext={(data) => {
              submitDream(data);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
