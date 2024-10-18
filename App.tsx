import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { ActivityIndicator } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { firebase } from './firebaseConfig';

// Import Screens
import HomeScreen from './components/HomeScreen';
import AddJournalScreen from './components/AddJournalScreen';
import ViewJournalScreen from './components/ViewJournalScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import SplashScreen from './components/SplashScreen';

// Stack and Drawer Navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Main Stack Navigator (for Home, AddJournal, and ViewJournal)
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddJournal" component={AddJournalScreen} />
      <Stack.Screen name="ViewJournal" component={ViewJournalScreen} />
    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true); // To handle SplashScreen visibility
  const [user, setUser] = useState(null); // User state (authenticated or not)

  useEffect(() => {
    // Setup Push Notification
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification:', notification);
      },
      requestPermissions: true,
    });

    // Firebase messaging listener
    const unsubscribe = firebase.messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message Data:', remoteMessage.data);
    });

    // Auth state change listener
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser); // Set the user if logged in
      } else {
        setUser(null); // Set to null if no user is logged in
      }
      setIsLoading(false); // Stop loading once the auth check is complete
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />; // Render the splash screen while loading
  }

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        {user ? (
          // If user is logged in, show the Drawer navigation
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          </Drawer.Navigator>
        ) : (
          // If no user, show the Login/Signup flow
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
