import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MedicosScreen() {

  const router = useRouter();

  const [filtro, setFiltro] = useState('Todos');

  const [medicos, setMedicos] = useState([
    { id: 1, nombre: 'Carlos', apellido: 'Ramirez', especialidad: 'Cardiología', estado: 'Activo' },
    { id: 2, nombre: 'Ana', apellido: 'Gomez', especialidad: 'Pediatría', estado: 'Inactivo' },
  ]);

  const medicosFiltrados = medicos.filter(medico =>
    filtro === 'Todos' || medico.estado === filtro
  );

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Médicos</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/(medicos)/agregarMedico')}
      >
        <Text style={styles.addButtonText}>Agregar Médico</Text>
      </TouchableOpacity>


      <View style={styles.filterRow}>

        <TouchableOpacity style={styles.filter} onPress={() => setFiltro('Todos')}>
          <Ionicons name="list" size={18} color="#333" />
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filter} onPress={() => setFiltro('Activo')}>
          <Ionicons name="checkmark-circle-outline" size={18} color="green" />
          <Text style={styles.filterText}>Activos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filter} onPress={() => setFiltro('Inactivo')}>
          <Ionicons name="close-circle-outline" size={18} color="red" />
          <Text style={styles.filterText}>Inactivos</Text>
        </TouchableOpacity>

      </View>


      {medicosFiltrados.map((medico) => (

        <View key={medico.id} style={styles.card}>

          <Text style={styles.cardTitle}>
            {medico.nombre} {medico.apellido}
          </Text>

          <Text style={styles.cardText}>
            Especialidad: {medico.especialidad}
          </Text>

          <Text style={styles.cardText}>
            Estado: {medico.estado.toUpperCase()}
          </Text>

          <View style={styles.actions}>

            <TouchableOpacity style={styles.action}>
              <Ionicons name="eye-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Ver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.action}
              onPress={() => router.push('/(tabs)/(medicos)/editarMedico')}
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
    fontWeight: 'bold',
    fontSize: 16
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },

  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  filterText: {
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
    marginBottom: 5
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