import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

const StorageScreen = () => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getPermission();
    loadFiles();
  }, []);

  const getPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert('Permission not granted!');
    }
  };

  const loadFiles = async () => {
    try {
      const fileDir = FileSystem.documentDirectory + 'files';
      const dirInfo = await FileSystem.getInfoAsync(fileDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
      }
      const fileList = await FileSystem.readDirectoryAsync(fileDir);
      setFileList(fileList);
    } catch (error) {
      Alert.alert('Error loading files', `${error.message}`);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: false });
      if (result.type === 'success') {
        const source = result.uri;
        const target = FileSystem.documentDirectory + 'files/' + result.name;
        const fileInfo = await FileSystem.getInfoAsync(target);
        if (fileInfo.exists) {
          Alert.alert('File already exists!');
        } else {
          await FileSystem.copyAsync({ from: source, to: target });
          setFileList([...fileList, result.name]);
        }
      }
    } catch (error) {
      Alert.alert('Failed to add file', `${error.message}`);
    }
  };

  const deleteFile = async (item) => {
    try {
      const target = FileSystem.documentDirectory + 'files/' + item;
      const fileInfo = await FileSystem.getInfoAsync(target);
      if (!fileInfo.exists) {
        Alert.alert('File not found!');
      } else {
        await FileSystem.deleteAsync(target);
        const newFileList = fileList.filter((file) => file !== item);
        setFileList(newFileList);
      }
    } catch (error) {
      Alert.alert('Failed to delete file', `${error.message}`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
      <Button title="Delete" onPress={() => deleteFile(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add file" onPress={pickDocument} />
      <FlatList data={fileList} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 14,
  },
});

export default StorageScreen;
