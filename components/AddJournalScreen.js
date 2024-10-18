import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Heading, Input, Button, Textarea, Icon, VStack, Spinner, HStack } from 'native-base';
import Voice from 'react-native-voice';
import { MaterialIcons } from '@expo/vector-icons';
import { firebase } from './firebaseConfig';

const AddJournalScreen = ({ route, navigation }) => {
  const { journalId } = route.params || {};  // If editing, this will be the journal ID
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If editing, fetch the journal details
    if (journalId) {
      const fetchJournal = async () => {
        const doc = await firebase.firestore().collection('journals').doc(journalId).get();
        if (doc.exists) {
          const journal = doc.data();
          setTitle(journal.title);
          setContent(journal.content);
        }
      };
      fetchJournal();
    }

    // Voice recognition results handling
    Voice.onSpeechResults = (e) => {
      const formattedContent = e.value[0] + '.'; // Adding a period for sentence termination
      setContent(content + ' ' + formattedContent);
    };

    // Cleanup when the component is unmounted
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [journalId, content]);

  // Start voice recording
  const startRecording = async () => {
    setIsRecording(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  // Stop voice recording
  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };

  // Save the journal (either create new or update)
  const handleSaveJournal = async () => {
    if (!title || !content) {
      alert('Please fill out both title and content');
      return;
    }

    setIsLoading(true); // Show loading spinner

    const journalData = {
      title,
      content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      if (journalId) {
        // Update existing journal entry
        await firebase.firestore().collection('journals').doc(journalId).update(journalData);
      } else {
        // Add new journal entry
        await firebase.firestore().collection('journals').add(journalData);
      }
      setIsLoading(false); // Hide loading spinner
      navigation.goBack();  // Navigate back after saving
    } catch (error) {
      console.error("Error saving journal: ", error);
      alert('Failed to save journal. Please try again.');
      setIsLoading(false); // Hide loading spinner on error
    }
  };

  // Cancel the changes and go back
  const handleCancel = () => {
    setTitle('');
    setContent('');
    navigation.goBack();
  };

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="5">
        <Heading size="lg">{journalId ? 'Edit Journal' : 'Add Journal'}</Heading>
        <VStack space={5} mt="5">
          {/* Title Input */}
          <Input
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Content Input (Textarea) */}
          <Textarea
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            height={200}
          />

          {/* Buttons */}
          <HStack space={4}>
            <Button onPress={handleSaveJournal} isLoading={isLoading} isDisabled={isLoading}>
              {journalId ? 'Update Journal' : 'Save Journal'}
            </Button>

            <Button onPress={handleCancel} variant="outline" colorScheme="gray">
              Cancel
            </Button>
          </HStack>

          {/* Voice Recording Button */}
          <Button onPress={isRecording ? stopRecording : startRecording} isDisabled={isLoading}>
            <Icon as={MaterialIcons} name={isRecording ? "stop" : "mic"} />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {/* Loading Spinner */}
          {isLoading && <Spinner size="lg" color="primary.500" />}
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default AddJournalScreen;
