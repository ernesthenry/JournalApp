import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Heading, Text, VStack, Button } from 'native-base';
import { firebase } from './firebaseConfig';

const ViewJournalScreen = ({ route, navigation }) => {
  const { journalId } = route.params;
  const [journal, setJournal] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      const doc = await firebase.firestore().collection('journals').doc(journalId).get();
      if (doc.exists) {
        setJournal(doc.data());
      }
    };

    fetchJournal();
  }, [journalId]);

  if (!journal) {
    return (
      <NativeBaseProvider>
        <Box flex={1} p="5" justifyContent="center" alignItems="center">
          <Text>Loading...</Text>
        </Box>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="5">
        <Heading size="lg">{journal.title}</Heading>
        <VStack space={5} mt="5">
          <Text>{journal.content}</Text>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default ViewJournalScreen;
