import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InstalacionesScreen() {
  const router = useRouter();

  const [instalaciones, setInstalaciones] = useState([
    { id: 1, nombre: 'Consultorio 101', tipo: 'OFICINA', ubicacion: 'Piso 1, Torre A' },
    { id: 2, nombre: 'Sala de Cirugía B', tipo: 'QUIROFANO', ubicacion: 'Piso 3, Torre B' },
  ]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Instalaciones</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/(instalaciones)/agregarInstalacion')}
      >
        <Text style={styles.addButtonText}>Agregar Instalación</Text>
      </TouchableOpacity>

      {instalaciones.map((inst) => (
        <View key={inst.id} style={styles.card}>
          <Text style={styles.cardTitle}>{inst.nombre}</Text>
          <Text style={styles.cardText}>Tipo: {inst.tipo}</Text>
          <Text style={styles.cardText}>Ubicación: {inst.ubicacion}</Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.action}
              onPress={() => Alert.alert("Detalles de Instalación", `Nombre: ${inst.nombre}\nTipo: ${inst.tipo}\nUbicación: ${inst.ubicacion}`)}
            >
              <Ionicons name="eye-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Ver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.action}
              onPress={() => router.push('/(tabs)/(instalaciones)/editarInstalacion')}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#051937',
    marginBottom: 15
  },
  addButton: {
    backgroundColor: '#051937',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#051937',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6
  },
  cardText: {
    color: '#ddd',
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  actionText: {
    color: '#fff'
  }
});