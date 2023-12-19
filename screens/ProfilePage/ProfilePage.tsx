// ProfileScreen.js

import React from 'react';
import { SafeAreaView, View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const backgroundImage = require('../ProfilePage/profile.jpg'); // Arka plan resmi URL
  const profileImage = require('../ProfilePage/avatar.jpg'); // Profil fotoğrafı URL
  const profileName = 'Ranch'; // Profil adı

  const [isFollowing, setFollowing] = React.useState(false);

  const handleFollowButton = () => {
    setFollowing((prevState) => !prevState);
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}     showsHorizontalScrollIndicator={false} >
      <SafeAreaView style={styles.safeAreaView}>
        <ImageBackground source={{ uri: backgroundImage }} style={styles.container}>

          <View style={styles.overlay}>
            <View style={styles.row}>
              <Avatar
                rounded
                source={{ uri: profileImage }}
                size="large"
                containerStyle={styles.avatarContainer}
              />
              <View style={styles.userInfo}>
                <Text style={styles.profileName}>{profileName}</Text>
                <View style={styles.userActions}>
                  <Text style={styles.followInfo}>Takipçiler: 1000 | Takip Edilen: 500</Text>
                  <View style={styles.userActionstwo}>
                  <TouchableOpacity
                    style={[styles.followButton, { backgroundColor: isFollowing ? 'gray' : 'black' }]}
                    onPress={handleFollowButton}
                  >
                    <Text style={styles.followButtonText}>{isFollowing ? 'Takip Ediliyor' : 'Takip Et'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Icon name="ellipsis-h" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
      <View style={styles.box}></View>
      <View style={styles.box}></View>
      <View style={styles.box}></View>
      <View style={styles.box}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'black',

  },
  container: {
    width: width,
    height: 250,
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    height: 250,
    alignItems: 'flex-start', 
    justifyContent: 'flex-end', 
    padding: 20,
    width: width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    margin:5,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userActionstwo:{
    justifyContent: 'flex-start', 
    flexDirection:'row',
  },
  userActions: {

  },
  followInfo: {
    color: 'white',
    marginBottom: 10,
  },
  followButton: {
    alignContent: 'center',
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  box: {
    width: width,
    height: 170,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: 'black',
  },
});

export default ProfileScreen;
