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

const RentalsItem = ({ item }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <Image
            style={styles.imgContainer}
            source={{
              uri: `${
                item?.rPhoto ||
                "https://img.freepik.com/free-icon/user_318-563642.jpg"
              }`,
            }}
          />
          <View>
            <Text style={styles.details}>{`Renter: ${
              String(item?.rName) || "NA"
            }`}</Text>
            <Text style={styles.details}>
              {`Vehicle: ${String(item?.make) || "NA"} ${
                String(item?.model) || "NA"
              } ${String(item?.trim) || "NA"}`}{" "}
            </Text>
            <Text style={styles.details}>{`Date: ${
              String(item?.date) || "NA"
            }`}</Text>
            <Text style={styles.details}>{`License Plate: ${
              String(item?.lPlate) || "NA"
            }`}</Text>
            <Text style={styles.details}>{`Price: ${
              parseFloat(item?.price) || "NA"
            }$`}</Text>

            {String(item?.confirmCode) &&
              String(item?.status) === "Approved" && (
                <View style={styles.details}>
                  <Text>
                    Confirmation Code: {String(item?.confirmCode) || "NA"}
                  </Text>
                </View>
              )}
          </View>
        </View>
        <View>
          <Text style={styles.status}>{String(item?.status)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RentalsItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  detailsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
  },

  details: {
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  status: {
    color: "#6C54B6",
    fontWeight: "bold",
    marginRight: 10,

  },
  imgContainer: {
    borderWidth: 2,
    borderColor: "#5A439D",
    borderRadius: "50%",
    width: 60,
    height: 60,
    marginRight: 10,
  },
  img: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%", 
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
