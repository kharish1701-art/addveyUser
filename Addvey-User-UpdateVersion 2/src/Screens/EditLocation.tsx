// EditLocationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostAPi } from '../api/getApi/getApi';
import { EndPoints } from '../services/EndPoints';
import LoadingModal from '../Components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditLocationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { location, onLocationUpdated } = route.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: location.city,
    fullAddress: location.fullAddress,
    lat: location?.lat,
    long: location?.long
  });

  const handleUpdate = async () => {
    const userToken = await AsyncStorage.getItem("authToken");

    const param = {
      url: EndPoints.updateLocation + location.id,
      body: formData,
      token: userToken || "",
      method: 'PUT'
    };

    const result = await PostAPi(param, setLoading);
    if (result?.success) {
      Alert.alert("Success", "Location updated successfully");
      onLocationUpdated?.(); // Refresh the list
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingModal />}
      <TextInput
        style={styles.input}
        value={formData.city}
        onChangeText={(text) => setFormData({ ...formData, city: text })}
        placeholder="City"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.fullAddress}
        onChangeText={(text) => setFormData({ ...formData, fullAddress: text })}
        placeholder="Full Address"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditLocationScreen;