import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Route } from './router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './firebase/config';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (isReady === false) {
    return null;
  }

  return (
    // <UserProvider>
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <Route />
        </View>
      </NavigationContainer>
    </Provider>
    // </UserProvider>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navBox: {
    padding: 16,

    borderColor: 'red',
  },
});
