import React, { useState } from 'react';
import { NativeBaseProvider, Box, Switch, Text, VStack, Button } from 'native-base';
import PushNotification from 'react-native-push-notification';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const scheduleReminder = () => {
    PushNotification.localNotificationSchedule({
      message: "Don't forget to write your journal today!",
      date: new Date(Date.now() + 60 * 1000), // Remind after 1 minute
    });
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} p="5">
        <VStack space={5}>
          <Text fontSize="lg">App Settings</Text>
          <Text>Dark Mode</Text>
          <Switch isChecked={isDarkMode} onToggle={toggleTheme} />
          <Button onPress={scheduleReminder}>Schedule Daily Reminder</Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default SettingsScreen;
