import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/auth/authOperations';

const Tabs = createBottomTabNavigator();

const Home = () => {
  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(logOut());
  };

  return (
    <Tabs.Navigator
      style={{ paddingTop: 9, height: 83 }}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Публікації') {
            iconName = 'view-grid-outline';
          } else if (route.name === 'Створити публикацію') {
            iconName = 'plus';
          } else if (route.name === 'Профіль') {
            iconName = 'account-outline';
          }

          return (
            <View
              style={{
                width: 70,
                height: 40,
                borderRadius: 20,
                backgroundColor: focused ? '#FF6C00' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name={iconName} color={color} size={24} />
            </View>
          );
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="Публікації"
        component={PostsScreen}
        options={{
          headerRight: () => (
            <Pressable onPress={logOutHandler}>
              <MaterialCommunityIcons name="logout" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen name="Створити публикацію" component={CreatePostsScreen} />
      <Tabs.Screen name="Профіль" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

export default Home;
