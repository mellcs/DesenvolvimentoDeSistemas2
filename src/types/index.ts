export type Event = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location: string;
  stats: { total: number; checkedIn: number; absent: number };
};

export type EventStats = {
  total: number;
  checkedIn: number;
  absent: number;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  document: string;
  checkedInAt: string | null;
};
