// src/Screens/ControlScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { firebaseConfig } from '../FirebaseConfig';
import {getDatabase,ref,get,update,child,set} from "firebase/database";
import { getAuth, signOut } from 'firebase/auth';


const ControlScreen = ({ navigation }) => {
  const [sensorState, setSensorState] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const [datos, setDatos]= React.useState(null);

      const obtenerDatos =async() => {
        const db = getDatabase(firebaseConfig.app);
        const dbRef = ref(db);
    
        try {
          const snapshot = await get(child(dbRef, "puerta"));
          if (snapshot.exists()) {
            const datosObtenidos = snapshot.val();
            console.log("Datos obtenidos:", datosObtenidos);
            setDatos(datosObtenidos); // Actualiza el estado con los datos obtenidos
          } else {
            console.log("No se encontraron datos");
          }
        } catch (error) {
          console.error("Error obteniendo datos:", error);
        }
    }


    React.useEffect( () => {
      obtenerDatos();
    }, [] );

    const StatusApagar = async (lugar, nuevoStatus) => {
      const db = getDatabase(firebaseConfig.app);
      const referencia = ref(db, `puerta/${lugar}`);
      const timestamp = new Date().toISOString(); // Obtiene la fecha y hora actuales en formato ISO
    
      try {
        await update(referencia, { 
          status: nuevoStatus, 
          timestamp: timestamp 
        });
        console.log("Datos actualizados correctamente");
        obtenerDatos(); // Vuelve a obtener los datos para reflejar los cambios
        setSensorState(false);
      } catch (error) {
        console.error("Error actualizando datos:", error);
      }
    };

    const StatusEncender = async (lugar, nuevoStatus) => {
      const db = getDatabase(firebaseConfig.app);
      const referencia = ref(db, `puerta/${lugar}`);
      const timestamp = new Date().toISOString(); // Obtiene la fecha y hora actuales en formato ISO
    
      try {
        await update(referencia, { status: nuevoStatus, timestamp: timestamp });
        console.log("Datos actualizados correctamente");
        obtenerDatos(); // Vuelve a obtener los datos para reflejar los cambios
        setSensorState(true);
      } catch (error) {
        console.error("Error actualizando datos:", error);
      }
    };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navigateToUsers = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register'); // Ajusta el nombre de la ruta según la configuración de tu aplicación
  };

  const toggleHelpModal = () => {
    setHelpModalVisible(!helpModalVisible);
  };

  const navigateToDataManager = () => {
    navigation.navigate('GestorData');
  };

  const handleLogout = () => {
    const auth = getAuth(firebaseConfig.app);
    signOut(auth)
      .then(() => {
        navigation.replace('Login'); // Redirige a la pantalla de inicio de sesión
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.headerBar}></View>
      <View style={styles.contentContainer}>
        <View style={styles.controlBox}>
          <Text style={[styles.controlLabel, darkMode && styles.controlLabelDark]}>Estado del Sensor</Text>
          <Text style={[styles.controlText, darkMode && styles.controlTextDark]}>{sensorState ? 'Activo' : 'Inactivo'}</Text>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, sensorState ? styles.indicatorOn : styles.indicatorOff]} />
          </View>
        </View>
        
        {datos ? (<>
        <TouchableOpacity style={[styles.controlButton]} onPress={() => StatusApagar("movimiento/conteo", datos.movimiento.conteo === 0 ? 1:0)}>
          <AntDesign name="poweroff" size={24} color="white" />
          <Text style={styles.buttonText}>APAGAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.turnOnButton]} onPress={() => StatusEncender("movimiento/conteo", datos.movimiento.conteo === 1 ? 0:1)}>
          <AntDesign name="poweroff" size={24} color="white" />
          <Text style={styles.buttonText}>ENCENDER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.dataManagerButton]} onPress={navigateToDataManager}>
          <AntDesign name="database" size={24} color="white" />
          <Text style={styles.buttonText}>GESTOR DE DATOS</Text>
        </TouchableOpacity>
    </>):(<>
        <Text>Datos cargando...</Text>
    </>)}

      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={navigateToUsers}>
          <AntDesign name="user" size={24} color="white" />
          <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={toggleDarkMode}>
          <AntDesign name="bulb1" size={24} color="white" />
          <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={toggleHelpModal}>
          <AntDesign name="questioncircleo" size={24} color="white" />
          <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="white" />
          <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}></Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Ayuda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, darkMode && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>Doorsensor</Text>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>
              Aquí va el contenido de ayuda sobre cómo usar la aplicación "Doorsensor".
              Puedes describir aquí las funciones principales y cómo navegar por la app.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleHelpModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#333',
  },
  headerBar: {
    backgroundColor: '#007BFF',
    height: 40, // Aumentado la altura de la barra superior
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlBox: {
    width: '100%',
    backgroundColor: '#FFF',
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  controlLabel: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  controlLabelDark: {
    color: '#DDD',
  },
  controlText: {
    fontSize: 18,
    color: '#333',
  },
  controlTextDark: {
    color: '#DDD',
  },
  controlButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  turnOnButton: {
    backgroundColor: '#34C759',
  },
  dataManagerButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonTextDark: {
    color: '#DDD',
  },
  indicatorContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  indicatorOn: {
    backgroundColor: 'green',
  },
  indicatorOff: {
    backgroundColor: 'red',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10, // Reducido el padding vertical de la barra inferior
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#007BFF', // Cambiado el color de fondo de la barra inferior
  },
  bottomBarButton: {
    alignItems: 'center',
    paddingTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalContentDark: {
    backgroundColor: '#444',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalTitleDark: {
    color: '#DDD',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalTextDark: {
    color: '#BBB',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControlScreen;
