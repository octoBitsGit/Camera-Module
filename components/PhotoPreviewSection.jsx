import { Fontisto, AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PhotoPreviewSection = ({ photo, handleRetakePhoto, handleSavePhoto }) => {
  // Check if the orientation information is available
  const isVertical = photo.orientation === 'vertical';
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        styles.imageWrapper,
        isVertical ? styles.verticalWrapper : styles.horizontalWrapper
      ]}>
        <Image
          style={styles.image}
          source={{ uri: photo.uri }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRetakePhoto}>
          <Fontisto name="trash" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSavePhoto}>
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
    height: height * 0.5,
    aspectRatio: 0.8 / 0.3, // Approximating the 80% width / 30% height ratio from the vertical guide box
  },
  horizontalWrapper: {
    width: width * 0.6,
    height: height * 0.4,
    aspectRatio: 0.6 / 0.5, // Approximating the 60% width / 50% height ratio from the horizontal guide box
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