import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../controllers/firebaseConfig";

import ListingsItem from "./ListingsItem";

const SearchScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'Listings')
      ),
      async (snapshot) => {
        try {
          // Extract the data from the documents
          const listingsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Forward geocode each listing to get latitude and longitude
          const geocodePromises = listingsData.map(async (listing) => {
            try {
              const geocodedLocation = await Location.geocodeAsync(listing.location);
              const result = geocodedLocation[0];
              if (result) {
                return {
                  ...listing,
                  latitude: result.latitude,
                  longitude: result.longitude,
                };
              }
            } catch (error) {
              console.log('Error in forward geocoding:', error);
            }
            return null;
          });
  
          // Wait for all geocoding promises to resolve
          const geocodedListings = await Promise.all(geocodePromises);
  
          // Filter out any null results
          const validListings = geocodedListings.filter((listing) => listing !== null);
  
          setListings(validListings);
          setLoading(false); // Set isLoading to false when data is received
        } catch (error) {
          console.error('Error fetching Listings:', error);
          setLoading(false); // Set isLoading to false if there was an error
        }
      },
      (error) => {
        console.error('Error fetching Listings:', error);
        setLoading(false); // Set isLoading to false if there was an error
      }
    );
  
    // Clean up the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);  

  // function to get user location i.e. device location
  const getUserLocation = async () => {
    try {
      // 1. get permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(`Permission to access location was denied`);
        return;
      }

      // 2. if permission granted, then get the location
      let location = await Location.getCurrentPositionAsync();
      console.log(`The current location is:`);
      console.log(location);

      // Display location to UI
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkerPress = (listing) => {
    setSelectedListing(listing);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {userLocation && (
          <MapView style={styles.map} initialRegion={userLocation}>
            {/* Add Marker for user's location */}
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You are here"
              pinColor="red"
            />
            {listings.map((listing) => (
              <Marker
                key={listing.id}
                coordinate={{
                  latitude: listing.latitude,
                  longitude: listing.longitude,
                }}
                onPress={() => handleMarkerPress(listing)}
              >
                <View style={styles.marker}>
                  <Text style={styles.markerText}>${listing.price}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
        <View style={styles.listingContainer}>
          <FlatList
            data={listings}
            renderItem={({ item }) => <ListingsItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF4F1",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  listingContainer: {
    flex: 1,
    flexDirection: "row",
  },
  map: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    overflow: "hidden",
  },
  marker: {
    backgroundColor: "#624CAB",
    padding: 8,
    borderRadius: 8,
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SearchScreen;
