import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'grey',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(principal)/index"
        options={{
          title: 'Principal',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="totens/index"
        options={{
          title: 'Totens',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
