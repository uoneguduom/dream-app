import DescriptionForm from '@/components/forms/DescriptionForm';
import PlacesForm from '@/components/forms/PlacesForm';
import PeoplesForm from '@/components/forms/PeoplesForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import uuid from 'react-native-uuid'

export default function Screen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Ajouter' });
    }, [navigation])
  );

  const [step, setStep] = React.useState('description');
  const [dream, setDream] = React.useState({});

  const saveDream = async (dream: object) => {
    const existing = await AsyncStorage.getItem('dreams');
    const dreams = existing ? JSON.parse(existing) : [];
    dreams.push(dream);
    await AsyncStorage.setItem('dreams', JSON.stringify(dreams));
  };

  const submitDream = (data: { peoples: string[]; places?: string[]; [key: string]: any }) => {
    const merged = { ...dream, ...data };
    const finalDream = {
      ...merged,
      date: new Date().toLocaleDateString('fr-FR'),
      keywords: [...(merged.places ?? []), ...(merged.peoples ?? [])],
      id: uuid.v4()
    };
    saveDream(finalDream);
    console.log('Rêve enregistré :', finalDream);
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="w-screen flex-1 items-center justify-center gap-8 p-4">
          {step === 'description' && (
            <DescriptionForm
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
            <PeoplesForm onNext={(data) => {
              submitDream({ ...dream, ...data })
              setStep('description')
            }} />
          )}
        </View>
      </ScrollView>
    </>
  );
}
