import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    cargarContador();
  }, []);

  useEffect(() => {
    guardarContador(contador);
  }, [contador]);

  const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem("contador");
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log("Error cargando");
    }
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem("contador", JSON.stringify(valor));
    } catch (e) {
      console.log("Error guardando");
    }
  };

  const incrementar = () => {
    setContador(contador + 1);
  };

  const pedirPermiso = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('¡Necesitamos permisos para enviarte notificaciones!');
    }
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Estado del Contador 🔢",
        body: `El valor actual de tu contador es: ${contador}`,
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App con Notificaciones y Contador</Text>

      <Text style={styles.counterText}>
        Contador: {contador}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Incrementar" color="#CA91FF" onPress={incrementar} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Pedir permiso" color="#CA91FF" onPress={pedirPermiso} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Enviar notificación con valor" color="#CA91FF" onPress={enviarNotificacion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  counterText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  }
});