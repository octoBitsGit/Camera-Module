import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Camera() {
  // State to manage which camera is active ('back' or 'front')
  const [facing, setFacing] = useState('back');
  
  // Hook to check and request camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  
  // State to store the taken photo (initially null)
  const [photo, setPhoto] = useState(null);
  
  // Reference to the CameraView component to call camera methods
  const cameraRef = useRef(null);

  // If the permission object isn't loaded yet, return an empty view.
  if (!permission) {
    return <View />;
  }

  // If permissions are loaded but not granted, show a prompt.
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Function to toggle between 'back' and 'front' cameras.
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Function to take a photo asynchronously.
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  // Function to retake the photo by resetting the photo state.
  const handleRetakePhoto = () => setPhoto(null);

  // If a photo has been taken, show the preview section.
  if (photo)
    return (
      <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />
    );

  // Main UI: Display the camera view with two buttons.
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Button to toggle camera facing */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={44} color="black" />
          </TouchableOpacity>
          {/* Button to take a photo */}
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={44} color="black" />
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
  camera: {
    flex: 1,
    bottom: 95
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
