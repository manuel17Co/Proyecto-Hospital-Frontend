import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AgregarInstalacionScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleGuardar = () => {
    console.log('Datos a enviar:', { nombre, tipo, ubicacion });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Registrar Nueva Instalación</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre (Ej. Consultorio 101)"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (Ej. Quirófano, Consultorio)"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación (Ej. Piso 1, Torre A)"
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar Instalación</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#051937', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  saveButton: { backgroundColor: '#051937', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
});