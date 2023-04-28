import React, { useState, useEffect } from 'react';
import { selectName, selectID } from '../redux/auth/selectors';
import { logOut, setAvatar } from '../redux/auth/authOperations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PostItem from '../component/PostComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const ProfileScreen = ({ navigation }) => {
  const auth = getAuth();
  const isAuth = useSelector(state => state.auth.isAuth);
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const id = useSelector(selectID);
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState();

  const addPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      dispatch(setAvatar(uri));
    }
  };

  const logOutHandler = () => {
    dispatch(logOut());
  };

  useEffect(() => {
    if (!isAuth) return;

    setImage(auth.currentUser.photoURL);
    const q = query(collection(db, 'posts'), where('uid', '==', id));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const post = [];
      querySnapshot.forEach(doc =>
        post.push({
          ...doc.data(),
          id: doc.id,
        })
      );
      setPosts(post);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/background_img2.jpg')}
      style={styles.image}
    >
      <View style={styles.box}>
        <View style={styles.imageWraper}>
          <Image style={styles.avatar} source={{ uri: image }} />
          <Pressable onPress={addPhoto} style={styles.pressIcon}>
            <Ionicons
              name="add-circle-outline"
              size={30}
              color="#bdbdbd"
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable onPress={logOutHandler} style={styles.logoutIcon}>
          <MaterialCommunityIcons name="logout" size={26} color="#aaa" />
        </Pressable>
        <Text style={styles.name}>{name}</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostItem
              navigation={navigation}
              title={item.imageSignature}
              photo={item.photo}
              imageLocation={item.imageLocation}
              uid={item.uid}
              id={item.id}
              location={item.location}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  box: {
    height: '85%',
    backgroundColor: '#fff',
    fontSize: 45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    marginLeft: 16,
    marginRight: 16,
  },
  post: {
    backgroundColor: '#ccc',
    width: 343,
    height: 299,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  imageWraper: {
    backgroundColor: 'green',
    borderRadius: 17,
    position: 'relative',
    height: 0,
  },

  avatar: {
    position: 'absolute',
    top: -48,
    width: 120,
    height: 120,

    borderRadius: 15,
    alignSelf: 'center',
  },

  pressIcon: {
    position: 'absolute',
    top: 18,
    left: 240,
    rotate: '45deg',
    collor: 'white',
  },

  icon: {
    rotate: '45deg',
  },

  container: {
    backgroundColor: 'grey',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    padding: 16,
    paddingBottom: 45,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  logoutIcon: {
    position: 'absolute',
    top: 20,
    right: 15,
  },

  name: {
    marginTop: 92,
    marginBottom: 32,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
