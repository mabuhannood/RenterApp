import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

import { auth } from './controllers/firebaseConfig';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import MyReservationsScreen from './screens/MyReservationsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ handleLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Search') {
            iconName = 'map-search';
          } else if (route.name === 'My Reservations') {
            iconName = 'calendar-check';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: 'red', fontSize: 18 }}>Logout</Text>
          </TouchableOpacity>
        ),
      })}
      tabBarOptions={{
        activeTintColor: '#624CAB',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="My Reservations" component={MyReservationsScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavigationContainer>
      {user ? <MainTabNavigator handleLogout={handleLogout} /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default App;
