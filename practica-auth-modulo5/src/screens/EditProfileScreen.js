import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, database } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "../styles/globalStyles";

export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    specialty: "",
    photoUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(database, "users", user.uid));
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            age: userData.age || "",
            specialty: userData.specialty || "",
            photoUrl: userData.photoUrl || ""
          });
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del perfil");
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    // Validaciones básicas
    if (!form.name.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    if (!form.email.trim()) {
      Alert.alert("Error", "El correo es obligatorio");
      return;
    }

    if (!form.age.trim()) {
      Alert.alert("Error", "La edad es obligatoria");
      return;
    }

    if (!form.specialty.trim()) {
      Alert.alert("Error", "La especialidad es obligatoria");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const updateData = {
          name: form.name.trim(),
          email: form.email.trim(),
          age: form.age.trim(),
          specialty: form.specialty.trim(),
          photoUrl: form.photoUrl.trim() || "https://via.placeholder.com/150",
          updatedAt: new Date()
        };

        await updateDoc(doc(database, "users", user.uid), updateData);
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil: " + error.message);
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10 }}>Cargando información del perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#777"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#777"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Edad"
        placeholderTextColor="#777"
        value={form.age}
        onChangeText={(value) => handleChange("age", value)}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Especialidad"
        placeholderTextColor="#777"
        value={form.specialty}
        onChangeText={(value) => handleChange("specialty", value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="URL de Foto de Perfil"
        placeholderTextColor="#777"
        value={form.photoUrl}
        onChangeText={(value) => handleChange("photoUrl", value)}
        autoCapitalize="none"
      />

      <TouchableOpacity 
        style={[styles.button, saving && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#666', marginTop: 10 }]} 
        onPress={() => navigation.goBack()}
        disabled={saving}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}