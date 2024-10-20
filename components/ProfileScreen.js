import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Heading, Input, Button, Avatar, HStack,Spinner, useToast } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { firebase } from './firebaseConfig';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setAvatar(user.photoURL || '');
    }
  }, []);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({ noData: true, quality: 0.5, maxWidth: 500, maxHeight: 500 }, (response) => {
      if (response.uri) {
        setAvatar(response.uri);
        uploadAvatar(response.uri);
      }
    });
  };

  const uploadAvatar = async (uri) => {
    setLoading(true);
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const storageRef = firebase.storage().ref(`avatars/${user.uid}`);
        await storageRef.putFile(uri);

        const avatarUrl = await storageRef.getDownloadURL();
        await user.updateProfile({ photoURL: avatarUrl });

        toast.show({
          description: 'Profile picture updated successfully!',
          status: 'success',
        });
      } catch (error) {
        toast.show({
          description: 'Error updating profile picture: ' + error.message,
          status: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} p="5">
        <Heading size="lg">Profile</Heading>
        <HStack space={4} mt="5" justifyContent="center">
          <Avatar source={{ uri: avatar }} size="xl" />
          <Button onPress={handleImagePick} isLoading={loading}>
            {loading ? 'Uploading...' : 'Change Avatar'}
          </Button>
        </HStack>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
          mt="5"
        />
        <Input
          placeholder="Email"
          value={email}
          isDisabled
          mt="5"
        />
        {loading && <Spinner mt="5" />}
      </Box>
    </NativeBaseProvider>
  );
};

export default ProfileScreen;
