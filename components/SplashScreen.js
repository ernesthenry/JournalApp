import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';
import { StatusBar, Animated } from 'react-native';
import LottieView from 'lottie-react-native';  // Animation

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));  // Fade animation for text

  useEffect(() => {
    // Start fading in the text after 2 seconds of splash animation
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,  // Fade-in duration
        useNativeDriver: true,
      }).start();
    }, 2000);  // Wait for the animation to play for 2 seconds

    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);  // Show splash screen for 3 seconds before navigating
  }, [fadeAnim, navigation]);

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" />
      <Box flex={1} justifyContent="center" alignItems="center">
        {/* Lottie Animation */}
        <LottieView
          source={require('./assets/splash-animation.json')}
          autoPlay
          loop={false}  // Run once and stop
        />

        {/* Animated Text */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text fontSize="2xl" bold>Welcome to JournalApp</Text>
        </Animated.View>
      </Box>
    </NativeBaseProvider>
  );
};

export default SplashScreen;
