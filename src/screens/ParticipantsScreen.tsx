import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ActivityIndicator, Searchbar, Snackbar, Text, Card, Button, Chip } from "react-native-paper";
import { api } from "../../client";
import { Participant, Event } from "../types";
import { ParticipantItem } from "../components/ParticipantItem";

export const ParticipantsScreen = ({ route }: any) => {
  const { id } = route.params;

  const [attendees, setAttendees] = useState<Participant[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [snack, setSnack] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setError(false);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch {
      setError(true);
      setSnack("Erro ao carregar o evento");
    }
  }, [id]);

  const fetchAttendees = useCallback(async () => {
    setLoading(true);
    try {
      setError(false);
      const res = await api.get(`/events/${id}/attendees?search=${query}`);
      setAttendees(res.data.data);
    } catch {
      setError(true);
      setSnack("Erro ao carregar participantes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, query]);

  useEffect(() => {
    fetchEvent();
    const debounce = setTimeout(fetchAttendees, 300);
    return () => clearTimeout(debounce);
  }, [fetchEvent, fetchAttendees, query]);

  const handleCheckin = async (attendeeId: string) => {
    try {
      await api.post(`/events/${id}/checkin`, { attendeeId });
      setSnack("Check-in realizado!");
      fetchAttendees();
      fetchEvent();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setSnack(
          `Já presente desde ${new Date(err.response.data.checkedInAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        );
      } else {
        setSnack("Erro no check-in");
      }
    }
  };

  const handleAlreadyCheckedIn = (checkedInAt: string) => {
    setSnack(
      `Já presente desde ${new Date(checkedInAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  };

  if (loading || !event)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffe6f0", padding: 16 }}>
      {/* Card com detalhes do evento */}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{event.title}</Text>
        <Text>
          {new Date(event.startsAt).toLocaleString()} - {new Date(event.endsAt).toLocaleString()}
        </Text>
        <Text>{event.location}</Text>
        <Text>
          Total: {event.stats.total} | Presentes: {event.stats.checkedIn} | Ausentes: {event.stats.absent}
        </Text>
      </Card>

      {/* Barra de pesquisa */}
      <Searchbar
        placeholder="Buscar..."
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 16 }}
        accessibilityLabel="Barra de busca de participantes"
      />

      {/* Mensagem de erro com botão "Tentar novamente" */}
      {error && (
        <Button
          mode="contained"
          onPress={() => {
            fetchEvent();
            fetchAttendees();
          }}
          style={{ marginBottom: 16, backgroundColor: "#f972b5ff" }}
          accessibilityLabel="Tentar novamente"
        >
          Tentar novamente
        </Button>
      )}

      {/* Lista de participantes */}
      {attendees.length === 0 && !loading && (
        <Text style={{ marginBottom: 16 }}>
          {query ? `Nada encontrado para '${query}'` : "Nenhum participante encontrado"}
        </Text>
      )}

      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParticipantItem
            attendee={item}
            onCheckin={handleCheckin}
            onAlreadyCheckedIn={handleAlreadyCheckedIn}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchAttendees();
              fetchEvent();
            }}
            colors={["#ff66b3"]}
          />
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <Snackbar visible={!!snack} onDismiss={() => setSnack("")} duration={3000}>
        {snack}
      </Snackbar>
    </View>
  );
};
