import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ActivityIndicator, Alert, useColorScheme, RefreshControl } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const API_KEY = '5588f0a4-62f6-4a17-807a-13db91faf58c';
const BASE_URL = 'https://todos.simpleapi.dev/api';

type Todo = {
  id: number;
  description: string;
  completed: number;
  meta?: boolean;
};

type RootStackParamList = {
  About: { 
    userEmail: string,
    isDarkMode: boolean
  };
  AddTask: {
    isDarkMode: boolean,
    todoId?: number,
    description?: string,
    isEditing?: boolean
  };
};

type Props = {
  route: RouteProp<RootStackParamList, 'About'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

function SecondScreen({route, navigation}: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const userEmail = route.params.userEmail;
  const name = userEmail.split('@')[0];

  const systemColorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    route.params.isDarkMode !== undefined ? route.params.isDarkMode : systemColorScheme === 'dark'
  );

  useEffect(() => {
    if (route.params.isDarkMode === undefined) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme]);

  const theme = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    textColor: isDarkMode ? '#fff' : '#000',
    subtitleColor: isDarkMode ? '#aaa' : '#666',
    cardBackground: isDarkMode ? '#333' : 'white',
    todoItemBackground: isDarkMode ? 'rgba(75, 75, 75, 0.5)' : 'rgba(128, 128, 128, 0.05)',
    todoTextColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#333',
    inputBackground: isDarkMode ? '#333' : '#fff',
    borderColor: isDarkMode ? '#444' : '#ddd',
    buttonBackground: '#ff7733',
    buttonText: '#fff',
    iconColor: isDarkMode ? '#fff' : '#000',
    alertText: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666'
  }

  // Fetch Todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/todos`, {
        params: { apikey: API_KEY }
      });
      
      console.log('Fetched Todos:', response.data);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch todos');
    }
  };

  // refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTodos();
    } catch (error) {
      console.error('Error refreshing todos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Delete Todo
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/todos/${id}`, {
        params: { apikey: API_KEY }
      });
      
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  // Edit Todo
  const editTask = (todo: Todo) => {
    navigation.navigate('AddTask', {
      isDarkMode,
      todoId: todo.id,
      description: todo.description,
      isEditing: true
    });
  };

  useEffect(() => {
    fetchTodos();
    
    // add listener to refresh todos
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos();
    });
    return unsubscribe;
  }, [navigation]);

  // Render Todos
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={[
      styles.todoItem, 
      { 
        backgroundColor: theme.todoItemBackground
      }
    ]}>
      <Text 
        style={[styles.todoText, {color: theme.todoTextColor}]}
      >
        {item.description}
      </Text>
      
      <View style={styles.todoActions}>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons 
            name="trash" 
            size={24} 
            color={theme.iconColor} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editTask(item)}>
          <Ionicons
            name="pencil"
            size={24}
            color={theme.iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: theme.backgroundColor}]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title,{color: theme.textColor}]}>Hey, Welcome Back</Text>
          <Text style={[styles.subTitle,{color: theme.subtitleColor}]}>{name}</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchTodos}
            disabled={loading}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color={theme.iconColor} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addTaskButton} 
            onPress={() => navigation.navigate('AddTask', { 
              isDarkMode,
              isEditing: false 
            })}
          >
            <Ionicons 
              name="add-circle" 
              size={24} 
              color={theme.iconColor} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.header,{backgroundColor: theme.cardBackground}]}>
        <Text style={[styles.headerTitle,{color: theme.textColor}]}>Todo List</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator 
          size="large" 
          color="#ff7733" 
          style={styles.loadingIndicator} 
        />
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={[styles.emptyListText,{color: theme.alertText}]}>No tasks found</Text>
          }
          contentContainerStyle={styles.todoList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#ff7733']}
              tintColor={isDarkMode ? '#fff' : '#ff7733'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 10,
  },
  addTaskButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 30,
    color: "#666"
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  todoList: {
    marginTop: 20,
    borderRadius: 20
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 2
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SecondScreen;