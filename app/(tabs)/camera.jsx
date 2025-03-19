// fil 
import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Switch } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [boxOrientation, setBoxOrientation] = useState('vertical');
  const [isLabelMode, setIsLabelMode] = useState(true); // Default to label mode
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleBoxOrientation() {
    setBoxOrientation((current) => (current === 'vertical' ? 'horizontal' : 'vertical'));
  }

  function toggleMode() {
    setIsLabelMode(previous => !previous);
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      
      // Define crop area based on guide box proportions
      const guideBoxWidth = boxOrientation === 'vertical' ? takenPhoto.width * 0.8 : takenPhoto.width * 0.6;
      const guideBoxHeight = boxOrientation === 'vertical' ? takenPhoto.height * 0.3 : takenPhoto.height * 0.5;
      const originX = (takenPhoto.width - guideBoxWidth) / 2;
      const originY = (takenPhoto.height - guideBoxHeight) / 2;
      
      const croppedPhoto = await ImageManipulator.manipulateAsync(
        takenPhoto.uri,
        [
          {
            crop: {
              originX,
              originY,
              width: guideBoxWidth,
              height: guideBoxHeight,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Add orientation and photo type information to the photo object
      croppedPhoto.orientation = boxOrientation;
      croppedPhoto.type = isLabelMode ? 'label' : 'fruit';
      setPhoto(croppedPhoto);
    }
  };

  const handleSavePhoto = async () => {
    if (photo && photo.uri) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need permission to access your photo library to save photos.'
        );
        return;
      }
      try {
        await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert('Success', 'Photo saved to your gallery!');
      } catch (error) {
        console.error('Error saving photo to gallery:', error);
        Alert.alert('Error', 'Failed to save photo to gallery.');
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) {
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleSavePhoto={handleSavePhoto}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.modeSelector}>
        <Text style={styles.modeText}>
          {isLabelMode ? 'Label Mode' : 'Fruit Mode'}
        </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Label</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isLabelMode ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleMode}
            value={!isLabelMode} // Inverted because true = fruit mode
          />
          <Text style={styles.switchLabel}>Fruit</Text>
        </View>
      </View>
      
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={[
            styles.guideBox, 
            boxOrientation === 'horizontal' && styles.horizontalGuideBox,
            isLabelMode ? styles.labelGuideBox : styles.fruitGuideBox
          ]} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={44} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={44} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleBoxOrientation}>
            <AntDesign name="swap" size={44} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modeSelector: {
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  modeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switchLabel: {
    color: 'white',
    marginHorizontal: 10,
  },
  camera: {
    flex: 1,
    bottom: 95,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '80%',
    height: '30%',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  horizontalGuideBox: {
    width: '60%',
    height: '50%',
  },
  labelGuideBox: {
    borderColor: '#f5dd4b', // Yellow for label mode
  },
  fruitGuideBox: {
    borderColor: '#81b0ff', // Blue for fruit mode
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
});