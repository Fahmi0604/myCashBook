import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Login from './src/screen/Login';
import Home from './src/screen/Home';
import TambahPemasukan from './src/screen/TambahPemasukan';
import TambahPengeluaran from './src/screen/TambahPengeluaran';
import CashFlow from './src/screen/CashFlow';
import Pengaturan from './src/screen/Pengaturan';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TambahPemasukan" component={TambahPemasukan} />
          <Stack.Screen
            name="TambahPengeluaran"
            component={TambahPengeluaran}
          />
          <Stack.Screen name="CashFlow" component={CashFlow} />
          <Stack.Screen name="Pengaturan" component={Pengaturan} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
