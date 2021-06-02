import React from 'react';
import { View } from 'react-native';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from "./app/utils/firebase";
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <FlashMessage position="top" />
    </View>
  );
}
