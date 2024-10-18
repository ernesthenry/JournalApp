import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, VStack, Text, Heading } from 'native-base';
import { firebase } from './firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="5">
        <Heading size="lg">Login</Heading>
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
          <Button onPress={handleLogin}>Login</Button>
          <Text>Don't have an account? <Text onPress={() => navigation.navigate('Signup')}>Sign up</Text></Text>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default LoginScreen;
