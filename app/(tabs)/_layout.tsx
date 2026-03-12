import { Tabs } from 'expo-router';
import { HomeIcon, MoonStarIcon } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Rechercher',
          tabBarIcon: ({ color }) => <MoonStarIcon color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
