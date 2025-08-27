import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { EventsScreen } from "./screens/EventsScreen";
import { ParticipantsScreen } from "./screens/ParticipantsScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: "Eventos" }}
      />
      <Stack.Screen
        name="Participants"
        component={ParticipantsScreen}
        options={{ title: "Participantes" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
