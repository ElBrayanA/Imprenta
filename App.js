import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './components/Nombres'; // Importar el contexto
import Navigation from './Navigation';

export default function App() {
  return (
    <UserProvider>

        <Navigation/>

    </UserProvider>
  );
}
