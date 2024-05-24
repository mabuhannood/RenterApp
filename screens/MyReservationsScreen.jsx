import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";

import { db, auth } from "../controllers/firebaseConfig";

// importing the firestore functions that you need
import { collection, query, where, onSnapshot } from "firebase/firestore";
import RentalsItem from "./RentalsItem";

const MyReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Bookings"),
        where("bookerEmail", "==", auth.currentUser.email)
      ),
      (snapshot) => {
        // Extract the data from the documents
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReservations(bookingsData);
        // console.log(bookingsData);
        setLoading(false); // Set isLoading to false when data is received
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false); // Set isLoading to false if there was an error
      }
    );

    // Clean up the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <FlatList
      data={reservations}
      renderItem={({ item }) => <RentalsItem item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF4F1",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "space-between",
  },
  carContainer: {
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleImage: {
    width: 420,
    height: 320,
    resizeMode: "cover",
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  bookingContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    fontSize: 18,
  },
  ownerContainer: {
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  ownerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    resizeMode: "cover",
    marginTop: 8,
    marginRight: 20,
  },
});

export default MyReservationsScreen;
