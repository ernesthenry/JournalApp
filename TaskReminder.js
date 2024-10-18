import { firebase } from './firebaseConfig';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

// Function to check tasks with 2-day remaining
const checkTaskReminders = async () => {
  const currentDate = moment().startOf('day'); // Today's date at midnight
  const twoDaysFromNow = currentDate.add(2, 'days');

  const tasksSnapshot = await firebase.firestore().collection('tasks').get();

  tasksSnapshot.forEach((doc) => {
    const task = doc.data();
    const taskDueDate = moment(task.dueDate.toDate());

    // Check if the task is due in 2 days
    if (taskDueDate.isSame(twoDaysFromNow, 'day')) {
      // Send push notification
      PushNotification.localNotification({
        title: 'Task Reminder',
        message: `Your task "${task.title}" is due in 2 days.`,
        playSound: true,
        soundName: 'default',
        channelId: 'default-channel',
      });
    }
  });
};

// Check tasks on app startup
checkTaskReminders();
