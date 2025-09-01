import React, { useState } from "react";
import { View, Text, Image, Button, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, database } from "../config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import styles from "../styles/globalStyles";

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigation.replace("Login");
        return;
      }
      
      const docSnap = await getDoc(doc(database, "users", user.uid));
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del usuario");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [navigation])
  );

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace("Login");
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión: " + error.message);
              console.error("Error signing out:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se pudo cargar la información del usuario</Text>
        <TouchableOpacity 
          style={[styles.button, { marginTop: 20 }]} 
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Ir a Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, alignItems: "center", alignSelf: "center", marginTop: 200 }}>
      <Image 
        source={{ uri: userData.photoUrl }} 
        style={{ 
          width: 120, 
          height: 120, 
          borderRadius: 60,
          marginBottom: 20,
          borderWidth: 3,
          borderColor: '#0066cc'
        }} 
      />
      
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: '#333'
      }}>
        Bienvenido, {userData.name}
      </Text>
      
      <Text style={{ 
        fontSize: 16, 
        marginBottom: 5,
        color: '#666'
      }}>
        Edad: {userData.age} años
      </Text>
      
      <Text style={{ 
        fontSize: 16, 
        marginBottom: 30,
        color: '#666'
      }}>
        Especialidad: {userData.specialty}
      </Text>

      <View style={{ width: '100%', gap: 10 }}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { 
            backgroundColor: '#dc3545',
            borderColor: '#dc3545'
          }]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}