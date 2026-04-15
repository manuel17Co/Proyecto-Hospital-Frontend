import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function InstalacionesScreen() {

  const router = useRouter();

  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const [instalaciones, setInstalaciones] = useState([
    { id: 1, nombre: 'Consultorio 101', tipo: 'Consultorio', ubicacion: 'Piso 1, Torre A', estado: 'Activo' },
    { id: 2, nombre: 'Sala de Cirugía B', tipo: 'Quirófano', ubicacion: 'Piso 3, Torre B', estado: 'Inactivo' },
  ]);

  const instFiltradas = instalaciones.filter(inst => {
    const cumpleFiltro = filtro === 'Todos' || inst.estado === filtro;
    const cumpleBusqueda = inst.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Instalaciones</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/(instalaciones)/agregarInstalacion')}
      >
        <Text style={styles.addButtonText}>Agregar Instalación</Text>
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


      {instFiltradas.map((inst) => (

        <View key={inst.id} style={styles.card}>

          <Text style={styles.cardTitle}>{inst.nombre}</Text>

          <Text style={styles.cardText}>
            Tipo: {inst.tipo}
          </Text>

          <Text style={styles.cardText}>
            Ubicación: {inst.ubicacion}
          </Text>

          <Text style={styles.cardText}>
            Estado: {inst.estado.toUpperCase()}
          </Text>

          <View style={styles.actions}>

            <TouchableOpacity style={styles.action}>
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
    fontWeight: 'bold',
    color: '#333'
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