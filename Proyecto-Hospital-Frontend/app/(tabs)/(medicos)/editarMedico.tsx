import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarMedicoScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('Carlos');
  const [apellido, setApellido] = useState('Ramirez');
  const [especialidad, setEspecialidad] = useState('Cardiología');

  const handleActualizar = () => {
    console.log('Actualizar:', { nombre, apellido, especialidad });
    router.back();
  };

  const confirmarEliminacion = () => {
    Alert.alert("Eliminar Médico", "¿Seguro que deseas eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", onPress: () => { console.log('Eliminado'); router.back(); } }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Editar Médico</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Especialidad" value={especialidad} onChangeText={setEspecialidad} />

      <TouchableOpacity style={styles.saveButton} onPress={handleActualizar}>
        <Text style={styles.saveButtonText}>Actualizar Médico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmarEliminacion}>
        <Text style={styles.deleteButtonText}>Eliminar Médico</Text>
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
  deleteButton: { backgroundColor: '#051937', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
});