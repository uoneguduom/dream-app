import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export { ErrorBoundary } from 'expo-router';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const Icon_ = colorScheme === 'dark' ? MoonStarIcon : SunIcon;
  return (
    <Button onPressIn={toggleColorScheme} size="icon" variant="ghost" className="ios:size-9 rounded-full web:mx-4">
      <Icon as={Icon_} className="size-5" />
    </Button>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Ajouter',
            headerTransparent: true,
            headerRight: () => <ThemeToggle />,
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
