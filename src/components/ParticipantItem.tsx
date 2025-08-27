import React from "react";
import { List, Button } from "react-native-paper";
import { Participant } from "../types";

type Props = {
  attendee: Participant;
  onCheckin: (id: string) => void;
  onAlreadyCheckedIn: (checkedInAt: string) => void;
};

export const ParticipantItem = ({ attendee, onCheckin, onAlreadyCheckedIn }: Props) => (
  <List.Item
    title={attendee.name}
    description={attendee.email}
    right={() =>
      attendee.checkedInAt ? (
        <Button
          mode="contained"
          disabled
          style={{ backgroundColor: "#ff66b3" }}
          onPress={() => onAlreadyCheckedIn(attendee.checkedInAt!)}
          accessibilityLabel={`Participante ${attendee.name} já presente`}
        >
          ✔️ Presente
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={() => onCheckin(attendee.id)}
          style={{ backgroundColor: "#ff66b3" }}
          accessibilityLabel={`Dar check-in no participante ${attendee.name}`}
        >
          Check-in
        </Button>
      )
    }
  />
);
