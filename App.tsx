import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TextInput, StyleSheet ,Dimensions } from 'react-native';

import HomeScreen from '../Moview/MainPages/HomePage/HomePage';
import Drafts from '../Moview/MainPages/Drafts/Drafts';
import ListPages from '../Moview/MainPages/ListPage/ListPage';
import ReviewPage from '../Moview/MainPages/ReviewPage/ReviewPage';
import ProfilePage from '../Moview/MainPages/ProfilePage/ProfilePage';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faPlus, faUser, faFilm, faList } from '@fortawesome/free-solid-svg-icons';


const Tab = createBottomTabNavigator();



const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Set this to false to hide the header (tab bar)
        }}
        tabBarOptions={{
          activeTintColor: 'red', // Change this to the desired focused tab color
          inactiveTintColor: 'black',
          style: {
            backgroundColor: 'black',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faHouse} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Drafts"
          component={Drafts}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faFilm} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ReviewPage"
          component={ReviewPage}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faPlus} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ListPages"
          component={ListPages}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faList} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faUser} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
