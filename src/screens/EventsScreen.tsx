import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { api } from "../../client";
import { Event } from "../types";

export const EventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch {
      // Pode colocar snackbar aqui
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffe6f0" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.title}>{event.title}</Text>
            <Text>
              {new Date(event.startsAt).toLocaleString()} - {new Date(event.endsAt).toLocaleString()}
            </Text>
            <Text>{event.location}</Text>
            <Text>
              Total: {event.stats.total} | Presentes: {event.stats.checkedIn} | Ausentes: {event.stats.absent}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Participants", { id: event.id })}
              accessibilityLabel={`Ver participantes do evento ${event.title}`}
              style={{ backgroundColor: "#ff66b3", marginTop: 8 }}
            >
              Ver participantes
            </Button>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
});
