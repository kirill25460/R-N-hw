import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { storage, db } from '../firebase/config';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectID, selectName } from '../redux/auth/selectors';
import { useIsFocused } from '@react-navigation/native';

const CreatePostsScreen = ({ navigation }) => {
  const [imageSignature, setImageSignature] = useState('');
  const [imageLocation, setImageLocation] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const uid = useSelector(selectID);
  const name = useSelector(selectName);
  const isFocused = useIsFocused();

  console.log('CreatePostsScreen');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === 'granted');
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation({
          coords: {
            latitude: 50.011206,
            longitude: 36.241585,
          },
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const imageTitleHandler = text => {
    setImageSignature(text);
  };

  const imageLocationHandler = text => {
    setImageLocation(text);
  };

  const imageDownloaderHandler = () => {
    // uploadPhotoToStorage();
    console.log('upload');
  };
  const onSubmit = async () => {
    await uploadPostToStorage();
    setImageSignature('');
    setImageLocation('');
    setPhoto(null);
    navigation.navigate('Публікації');
  };

  const flipCamera = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const uploadPhotoToStorage = async () => {
    const response = await fetch(photo);
    const file = await response.blob();

    const imageId = v4();
    const storageRef = ref(storage, `postImage/${imageId}`);

    await uploadBytes(storageRef, file).then(snapshot => {
      console.log('Uploaded a blob or file!');
    });
    const storageUrlPhoto = await getDownloadURL(
      ref(storage, `postImage/${imageId}`)
    );
    return storageUrlPhoto;
  };

  const uploadPostToStorage = async () => {
    const photo = await uploadPhotoToStorage();
    console.log(imageSignature, imageLocation, location, photo);
    try {
      const valueObj = {
        name,
        uid,
        imageSignature,
        imageLocation,
        photo,
        commentCounter: 0,
      };
      if (location) valueObj.location = location.coords;
      const docRef = await addDoc(collection(db, 'posts'), valueObj);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView styles={styles.box} backGroundColor="#fff">
        <View style={styles.container}>
          {isFocused && (
            <Camera
              style={styles.camera}
              type={type}
              ref={ref => {
                setCameraRef(ref);
              }}
            >
              {photo && (
                <View style={styles.takePhotoContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 200, height: 200 }}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.flipContainer}
                onPress={flipCamera}
              >
                <MaterialCommunityIcons
                  name="camera-flip-outline"
                  size={24}
                  style={{ color: 'white' }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shootButton} onPress={takePhoto}>
                <View style={styles.takePhotoOut}>
                  <View style={styles.takePhotoInner}>
                    <MaterialCommunityIcons name="camera-outline" size={24} />
                  </View>
                </View>
              </TouchableOpacity>
            </Camera>
          )}
          <Pressable onPress={imageDownloaderHandler}>
            <Text style={styles.text}>Завантажте фото</Text>
          </Pressable>

          <TextInput
            value={imageSignature}
            onChangeText={imageTitleHandler}
            placeholder="Назва"
            style={styles.input}
          />
          <View position="relative">
            <Pressable style={styles.mapButton}>
              <MaterialCommunityIcons
                name="map-marker-plus-outline"
                size={24}
              />
            </Pressable>
            <TextInput
              value={imageLocation}
              onChangeText={imageLocationHandler}
              placeholder="Місцевість"
              style={styles.input}
            ></TextInput>
          </View>
          <Pressable onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Опублікувати</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backGroundColor: '#fff',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  camera: {
    height: 300,
    marginTop: 30,
    borderRadius: 5,
  },
  photoView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  flipContainer: {
    flex: 0.1,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },

  shootButton: {
    alignSelf: 'center',
    top: 200,
  },

  takePhotoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderColor: '#ddd',
    borderWidth: 3,
    width: 200,
    height: 200,
  },

  takePhotoOut: {
    borderWidth: 2,
    borderColor: '#ffffff67',
    height: 50,
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: '#ccc',
    height: 40,
    width: 40,
    backgroundColor: '#ffffff80',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 343,
    height: 240,
  },

  text: {
    marginTop: 10,
    textAlign: 'center',
  },

  input: {
    paddingLeft: 50,
    height: 44,
    padding: 10,
    backgroundColor: '#E8E8E8',
    marginTop: 16,
    borderRadius: 10,
  },
  mapButton: {
    position: 'absolute',
    top: 28,
    left: 10,
  },
  button: {
    backgroundColor: '#FF6C00',
    borderRadius: 32,
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default CreatePostsScreen;
