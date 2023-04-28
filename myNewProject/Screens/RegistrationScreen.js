import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
  Alert,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { register } from '../redux/auth/authOperations';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhotoToStorage } from '../redux/auth/authOperations';

const Registration = ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [ava, setAva] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const loginHandler = text => setLogin(text);
  const emailHandler = text => setEmail(text);
  const passwordHandler = text => setPassword(text);

  const onSubmit = () => {
    if (login === '' || email === '' || password === '') {
      return Alert.alert('Заповнить поля');
    } else {
      dispatch(register({ email, password, login, avatar }));
    }
  };

  const onTransition = () => {
    navigation.navigate('Логін');
  };

  const addPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setAva(result.assets[0].uri);
    setAvatar(await uploadPhotoToStorage(result.assets[0].uri));
  };

  useEffect(() => {}, [ava]);

  return (
    <ImageBackground
      source={require('../assets/images/background_img2.jpg')}
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.avatarWraper}>
          <Image style={styles.avatar} source={{ uri: ava }} />
          <Pressable onPress={addPhoto}>
            <Ionicons
              name="add-circle-outline"
              size={30}
              color="#FF6C00"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView>
            <Text style={styles.title}>Реєстрація</Text>
            <TextInput
              value={login}
              onChangeText={loginHandler}
              placeholder="Логін"
              style={styles.input}
            />
            <TextInput
              value={email}
              onChangeText={emailHandler}
              placeholder="Адреса електронної пошти"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={passwordHandler}
              placeholder="Придумайте пароль"
              secureTextEntry={true}
              style={styles.input}
            />

            <Pressable onPress={onSubmit} style={styles.button}>
              <Text style={styles.text}>Зареєструватись</Text>
            </Pressable>
            <View style={styles.subscribe}>
              <Text style={styles.posttext}>Вже є акаунт? </Text>
              <Pressable onPress={onTransition}>
                <Text style={styles.loginLink}>Увійти</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    padding: 16,
    paddingBottom: 45,
    alignItems: 'stretch',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  avatar: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 10,
  },

  avatarWraper: {
    position: 'absolute',
    zIndex: 5,
    top: -76,
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    alignSelf: 'center',
  },

  icon: {
    top: 70,
    left: 105,
  },

  title: {
    marginTop: 92,
    marginBottom: 16,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 44,
    padding: 10,
    backgroundColor: '#E8E8E8',
    marginTop: 16,
    borderRadius: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  button: {
    backgroundColor: '#FF6C00',
    borderRadius: 32,
    padding: 16,
    marginVertical: 16,
    marginTop: 43,
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
  },

  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },

  subscribe: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default Registration;
