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
import moment from "moment"; // Import moment library
// importing the firestore functions that you need
import { collection, addDoc } from "firebase/firestore";

const ListingsItem = ({ item }) => {
  //   const [status, setStatus] = useState("Pending");
  const [name, setName] = useState(auth.currentUser.email.split("@")[0]);
  const [photo, setPhoto] = useState(
    "https://img.freepik.com/free-icon/user_318-563642.jpg"
  );

  const addBooking = async (item) => {
    try {
      const randomDate = moment()
        .year(2023)
        .dayOfYear(Math.floor(Math.random() * 365) + 1)
        .format("YYYY-MM-DD");
      const dataToAdd = {
        bookerEmail: auth.currentUser.email,
        confirmCode: parseInt(item?.confirmCode),
        date: randomDate,
        id: parseInt(item?.id),
        lPlate: String(item?.lPlate),
        make: String(item?.make),
        model: String(item?.model),
        ownerEmail: String(item?.ownerEmail),
        price: parseFloat(item?.price),
        rName: name,
        rPhoto: photo,
        status: "Pending",
        trim: String(item?.trim),
        location: String(item?.location),
      };
      const res = await addDoc(collection(db, "Bookings"), dataToAdd);

      console.log(res);
      alert("Booking created!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.detailsContainer}>
          <View style={styles.imgDetails}>
            <Image source={{ uri: item?.image }} style={styles.imgVehicle} />
            <View>
              <Text style={styles.details}>
                {`Vehicle: ${item?.make || "NA"} ${item?.model || "NA"} ${
                  item?.trim || "NA"
                }`}{" "}
              </Text>
              <Text style={styles.details}>{`Year: ${
                item?.year || "NA"
              }`}</Text>
              <Text style={styles.details}>{`License Plate: ${
                item?.lPlate || "NA"
              }`}</Text>
              <Text style={styles.details}>{`Location: ${
                item?.location || "NA"
              }`}</Text>
              <Text style={styles.details}>{`Price: $${
                item?.price || "NA"
              }`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.saveButtonContainer}>
          <Pressable onPress={() => addBooking(item)} style={styles.btn}>
            <Text style={styles.btnLabel}>BOOK NOW</Text>
          </Pressable>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

export default ListingsItem;

const styles = StyleSheet.create({
  container: {
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  listContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#F3F1F9",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  detailsContainer: {
    padding: 2,
    flexDirection: "row",
  },
  imgDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: 10,
  },
  details: {
    fontSize: 13,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 1,
  },
  saveButtonContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  btn: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    backgroundColor: "#624CAB",
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: "#ffffff",
    textAlign: "center",
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
  imgContainer: {
    borderRadius: "50%",
    width: 60,
    height: 60,
  },
  img: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  imgVehicle: {
    width: 100,
    height: 80,
    marginRight: 10,
  },
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%", // Set each item to take up full width
    padding: 5,
  },
  separator: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
  },
});
