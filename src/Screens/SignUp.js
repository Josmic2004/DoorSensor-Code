import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../FirebaseConfig';

import { useNavigation } from '@react-navigation/native';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState([]);
  
  const navigation = useNavigation();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleCreateAccount = () => {

    if (errorRegistro()) {
      // Si hay errores, detén la ejecución aquí
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Éxito', 'Cuenta creada correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      }); 
  }

  const errorRegistro = () => {

    let errors = [];

    if (password.length < 8 || confirmPassword.length < 8) {
      errors.push('Las contraseñas deben tener al menos 8 caracteres.');
    }

    if (password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden.');
    }

    if (email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      errors.push('Todos los campos son requeridos.');
    }

    if (errors.length > 0) {
      setSignupErrors(errors);
      return true; // Indica que hay errores
    }

    return false; // Indica que no hay errores
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <View style={styles.container}>
        <Image style={styles.tinylogo} source={{uri:"https://th.bing.com/th/id/R.f8dc3eacf5b360c85b803f87e06d57ab?rik=YrVpw477RIXe%2fQ&pid=ImgRaw&r=0"}}/>
        <Text style={styles.title}>Door Sensor</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.toggleButton} onPress={toggleShowPassword}>
          <Text style={styles.toggleButtonText}>
          <Icon
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="gray"
          />
          </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          secureTextEntry={!showPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.toggleButton} onPress={toggleShowPassword}>
          <Text style={styles.toggleButtonText}>
          <Icon
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="gray"
          />
          </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>REGISTRARSE</Text>
        </TouchableOpacity>
        {signupErrors.length > 0 && (
          <View style={styles.errorContainer}>
            {signupErrors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.footerText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.signup} onPress={handleLogin}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </>
  );

}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  toggleButtonText: {
    color: '#34DAFF',
    fontSize: 14,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#34DAFF',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#34DAFF',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    width: '80%',
    marginTop: 10,
    backgroundColor: '#FFCCCC',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
  },
  signup: {
    fontWeight: 'bold',
    color: '#34DAFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  tinylogo: {
    width: 100,
    height: 100,
  },
});

export default SignUp;
