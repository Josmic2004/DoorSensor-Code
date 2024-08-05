import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, child, get } from 'firebase/database';
import { firebaseConfig } from '../FirebaseConfig';
import AntDesign from '@expo/vector-icons/AntDesign';

const GestorDataScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    const db = getDatabase(firebaseConfig.app);
    const dbRef = ref(db);

    try {
      const snapshot = await get(child(dbRef, "puerta/movimiento/detecciones"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setData(Object.entries(data)); // Convertir el objeto en un array para FlatList
        setTotalCount(Object.entries(data).length); // Actualizar el conteo total de registros
      } else {
        console.log("No se encontraron datos");
        setTotalCount(0); // Si no hay datos, el conteo total es 0
      }
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const [key, { estado }] = item;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{estado}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navBar} onPress={() => navigation.navigate('Home')}>
        <AntDesign name="arrowleft" size={24} color="white" />
        <Text style={styles.navText}>Volver a Control</Text>
      </TouchableOpacity>
      <View style={styles.logodata}>
        <AntDesign name="database" size={70} color="orange"/>
      </View>
      <Text style={styles.title}>Gestor de Datos</Text>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Estado</Text>
        <Text style={styles.headerText}>Fecha y Hora</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item[0]}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay datos disponibles</Text>}
      />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Total de registros: {totalCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  navText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  logodata: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB5B00',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFB22C',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  itemText: {
    flex: 1,
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
    fontSize: 16,
  },
  countContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#FFB22C',
    alignItems: 'center',
  },
  countText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GestorDataScreen;
