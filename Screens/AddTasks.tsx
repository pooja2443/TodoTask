import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_KEY = '5588f0a4-62f6-4a17-807a-13db91faf58c';
const BASE_URL = 'https://todos.simpleapi.dev/api';

type RootStackParamList = {
  About: { 
    userEmail: string;
    isDarkMode: boolean;
  };
  AddTask: {
    isDarkMode: boolean;
    todoId?: number;
    description?: string;
    isEditing?: boolean;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export default function AddTask({ route, navigation }: Props) {
  const [description, setDescription] = useState(route.params.description);
  const [isLoading, setIsLoading] = useState(false);
  
  const isDarkMode = route.params.isDarkMode;
  const isEditing = route.params.isEditing || false;
  const todoId = route.params.todoId;

  const theme = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    textColor: isDarkMode ? '#fff' : '#000',
    inputBackground: isDarkMode ? '#333' : '#fff',
    borderColor: isDarkMode ? '#444' : '#ddd',
    headerBackground: isDarkMode ? '#333' : '#fff',
    placeholderColor: isDarkMode ? '#888' : '#666',
    iconColor: isDarkMode ? '#fff' : '#000'
  };

  const handleSave = async () => {
  
    setIsLoading(true);
    try {
      if (isEditing && todoId) {
        // Update existing todo
        await axios.put(
          `${BASE_URL}/todos/${todoId}`,
          { description },
          {
            params: { apikey: API_KEY },
          }
        );
        Alert.alert('Success', 'Task updated successfully');
        navigation.goBack();
      } else {
        // Add new todo
        await axios.post(
          `${BASE_URL}/todos`,
          { description },
          {
            params: { apikey: API_KEY },
          }
        );
        Alert.alert('Success', 'Task added successfully');
        setDescription('');
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      Alert.alert(
        'Error', 
        isEditing ? 'Failed to update task' : 'Failed to add task'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.iconColor} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.borderColor,
              color: theme.textColor
            }
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder={isEditing ? "Update task description" : "Enter task description"}
          placeholderTextColor={theme.placeholderColor}
          multiline
          autoFocus
        />
      
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { opacity: isLoading ? 0.7 : 1 }
          ]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Task' : 'Add Task'}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40, // For layout balance
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#ff7733',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});