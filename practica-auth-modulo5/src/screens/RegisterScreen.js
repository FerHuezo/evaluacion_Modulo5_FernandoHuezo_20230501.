import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import styles from "../styles/globalStyles";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    specialty: "",
    photoUrl: ""
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(database, "users", userCredential.user.uid), {
        ...form,
        photoUrl: form.photoUrl || "https://via.placeholder.com/150",
        createdAt: new Date()
      });
      Alert.alert("Registro exitoso");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#777" onChangeText={(v) => handleChange("name", v)} />
      <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#777" onChangeText={(v) => handleChange("email", v)} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry placeholderTextColor="#777" onChangeText={(v) => handleChange("password", v)} />
      <TextInput style={styles.input} placeholder="Edad" placeholderTextColor="#777" onChangeText={(v) => handleChange("age", v)} />
      <TextInput style={styles.input} placeholder="Especialidad" placeholderTextColor="#777" onChangeText={(v) => handleChange("specialty", v)} />
      <TextInput style={styles.input} placeholder="URL de Foto" placeholderTextColor="#777" onChangeText={(v) => handleChange("photoUrl", v)} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}
