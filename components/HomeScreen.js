import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Heading, FlatList, Text, HStack, Button, IconButton } from 'native-base';
import { firebase } from './firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [journals, setJournals] = useState([]);

  // Fetch journals from Firebase
  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('journals')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const journalData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJournals(journalData);
      });

    return () => unsubscribe();  // Cleanup the listener
  }, []);

  const handleEdit = (journalId) => {
    navigation.navigate('AddJournal', { journalId });
  };

  const renderJournalItem = ({ item }) => (
    <Box borderBottomWidth={1} p="5" key={item.id}>
      <HStack justifyContent="space-between">
        <Text bold>{item.title}</Text>
        <HStack space={2}>
          <IconButton
            icon={<MaterialIcons name="edit" size={24} />}
            onPress={() => handleEdit(item.id)}
          />
          <IconButton
            icon={<MaterialIcons name="delete" size={24} />}
            onPress={() => handleDelete(item.id)}
          />
        </HStack>
      </HStack>
      <Text>{item.content.substring(0, 100)}...</Text>
    </Box>
  );

  const handleDelete = async (journalId) => {
    try {
      await firebase.firestore().collection('journals').doc(journalId).delete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} p="5">
        <Heading size="lg" mb="5">My Journals</Heading>
        <FlatList
          data={journals}
          renderItem={renderJournalItem}
          keyExtractor={item => item.id}
        />
        <Button onPress={() => navigation.navigate('AddJournal')}>Add New Journal</Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default HomeScreen;
