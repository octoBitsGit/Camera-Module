import { Fontisto } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreviewSection = ({ photo, handleRetakePhoto }) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                <Fontisto name="trash" size={36} color="black" />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '90%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        width: '95%',
        height: '75%',
        borderRadius: 15,
    },
    buttonContainer: {
        marginTop: '1%',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoPreviewSection;
