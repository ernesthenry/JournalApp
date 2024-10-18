import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, VStack, Text, Heading } from 'native-base';
import { firebase } from './firebaseConfig';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      navigation.replace('Home');
    } catch (error) {
        alert(error.message);
    }
  };

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="5">
        <Heading size="lg">Sign Up</Heading>
        <VStack space={5} mt="5">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button onPress={handleSignup}>Sign Up</Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignupScreen;
