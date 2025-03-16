import { Fontisto, AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreviewSection = ({ photo, handleRetakePhoto, handleSavePhoto }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.imageWrapper}>
      <Image
        style={styles.image}
        // Display the saved image URI if available, or fallback to base64.
        source={
          photo.uri
            ? { uri: photo.uri }
            : { uri: 'data:image/jpg;base64,' + photo.base64 }
        }
      />
    </View>
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handleRetakePhoto}>
        <Fontisto name="trash" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleSavePhoto}>
        <AntDesign name="save" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Sleek dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4, // Adjust this ratio as needed for your images
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#333', // Fallback background color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  actionButton: {
    backgroundColor: '#4CAF50', // Vibrant green for a pop of color
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
});

export default PhotoPreviewSection;
