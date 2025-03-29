import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Dimensions, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

const PhotoPreviewSection = ({ photo, handleRetakePhoto, handleSavePhoto }) => {
  const [imageUri, setImageUri] = useState(null);
  const [processedUri, setProcessedUri] = useState(null);
  const isVertical = photo?.orientation === 'vertical';

  useEffect(() => {
    // Process the photo URI to ensure it's in a format that can be displayed/saved
    const processPhotoUri = async () => {
      if (!photo || !photo.uri) return;
      
      // If the photo URI is already local (i.e. within FileSystem.documentDirectory), no need to copy
      if (Platform.OS === 'ios' && !photo.uri.includes(FileSystem.documentDirectory) && photo.uri.startsWith('ph://')) {
        const fileName = `${Date.now()}.jpg`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;
        
        try {
          await FileSystem.copyAsync({
            from: photo.uri,
            to: newUri
          });
          console.log('Successfully copied file to:', newUri);
          setImageUri(newUri);
          setProcessedUri(newUri);
        } catch (error) {
          console.log('Error copying file:', error);
          // Use the original URI as a fallback if copying fails
          setImageUri(photo.uri);
          setProcessedUri(null);
        }
      } else {
        // For Android or if the URI is already local, use the URI directly
        setImageUri(photo.uri);
        setProcessedUri(null);
      }
    };

    processPhotoUri();

    // Cleanup: delete temporary file when component unmounts
    return () => {
      cleanupTemporaryFile();
    };
  }, [photo]);

  // Function to clean up the temporary file
  const cleanupTemporaryFile = async () => {
    if (processedUri && processedUri.startsWith(FileSystem.documentDirectory)) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(processedUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(processedUri, { idempotent: true });
          console.log('Deleted temporary file:', processedUri);
        }
      } catch (error) {
        console.log('Error cleaning up temporary file:', error);
      }
    }
  };

  // When retaking the photo, clean up temporary file first
  const onRetakePhoto = async () => {
    await cleanupTemporaryFile();
    handleRetakePhoto();
  };

  // When saving the photo, use the processed URI (if available) or fallback to the original URI
  const onSavePhoto = () => {
    const uriToSave = processedUri || photo.uri;
    handleSavePhoto(uriToSave);
  };

  // Only render once a valid image URI is available
  if (!imageUri) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.imageWrapper,
          isVertical ? styles.verticalWrapper : styles.horizontalWrapper
        ]}
      >
        <Image
          style={styles.image}
          source={{ uri: imageUri }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onRetakePhoto}>
          <AntDesign name="delete" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={onSavePhoto}>
          <AntDesign name="save" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalWrapper: {
    width: width * 0.8,
    height: height * 0.3,
  },
  horizontalWrapper: {
    width: width * 0.6,
    height: height * 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  actionButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});

export default PhotoPreviewSection;
