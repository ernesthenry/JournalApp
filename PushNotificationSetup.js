import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('Notification received:', notification);
    // You can navigate to a specific screen here if needed
  },
  requestPermissions: true,
});

// Request permission for push notifications
messaging()
  .requestPermission()
  .then(() => {
    console.log('Permission granted!');
  })
  .catch(error => {
    console.log('Permission denied:', error);
  });

// Handle incoming notifications
messaging().onMessage(async remoteMessage => {
  console.log('Foreground message:', remoteMessage);
  PushNotification.localNotification({
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  });
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('Notification opened from background state:', remoteMessage);
});

// Get the token to send notifications
messaging()
  .getToken()
  .then(token => {
    console.log('FCM Token:', token);
  });

// Create a channel for Android notifications
PushNotification.createChannel(
  {
    channelId: 'default-channel', // Must be unique
    channelName: 'Default Notifications', // Channel name
    channelDescription: 'A default channel for notifications',
    soundName: 'default',
    importance: 4, // High importance
  },
  (created) => console.log(`Create channel returned '${created}'`),
);
