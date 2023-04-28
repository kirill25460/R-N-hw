import React from 'react';

import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ route }) => {
  console.log(route.params);
  let latitude = 50.011206;
  let longitude = 36.241585;
  if (route.params.location) {
    latitude = route.params.location.latitude;
    longitude = route.params.location.longitude;
  }
  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.06,
        }}
      >
        <Marker
          title="I am here"
          coordinate={{ latitude: latitude, longitude: longitude }}
          description="Hello"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Map;
