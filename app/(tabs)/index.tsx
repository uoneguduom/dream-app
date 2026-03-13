import DescriptionForm from '@/components/forms/DescriptionForm';
import PlacesForm from '@/components/forms/PlacesForm';
import PeoplesForm from '@/components/forms/PeoplesForm';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native';

export default function Screen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'Ajouter' });
    }, [navigation])
  );

  const [step, setStep] = React.useState('description');
  const [dream, setDream] = React.useState({});

  const submitDream = (data: object) => {
    const finalDream = { ...dream, ...data };
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
            <PeoplesForm onNext={(data) => submitDream({ ...dream, ...data })} />
          )}
        </View>
      </ScrollView>
    </>
  );
}
