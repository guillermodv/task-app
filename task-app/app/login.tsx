import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    setErrorUsername('');
    setErrorPassword('');

    let valid = true;

    if (username.trim() === '') {
      setErrorUsername('El usuario es obligatorio');
      valid = false;
    }

    if (password.trim() === '') {
      setErrorPassword('La contraseña es obligatoria');
      valid = false;
    }

    if (!valid) return;

    if (username === 'prueba' && password === 'prueba') {
      router.push('/homeScreen');
    } else {
      setErrorPassword('Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={[styles.input, errorUsername ? styles.inputError : null]}
        placeholder="Usuario (prueba)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {errorUsername ? <Text style={styles.errorText}>{errorUsername}</Text> : null}

      <TextInput
        style={[styles.input, errorPassword ? styles.inputError : null]}
        placeholder="Contraseña (prueba)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff'
  },
  title: {
    fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 4
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 4
  }
});
