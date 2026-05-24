import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar style="light" backgroundColor="#09090b" />
				<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#09090b' } }} />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
