import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "tamagui";
import { useRouter } from "expo-router";
import { useMemo, useCallback, useState, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import { format } from "date-fns";

// Define the types for our bookings data
type Sport = "Acrobatics" | "Dance" | "Archery" | "Yoga";

interface Booking {
  id: string;
  sport: Sport;
  startDateTime: Date;
  endDateTime: Date;
}

interface SectionData {
  title: string;
  data: Booking[];
}

// Sport icons component mapping
const SportIcon = ({ sport }: { sport: Sport }) => {
  switch (sport) {
    case "Acrobatics":
      return <Text style={styles.sportIcon}>🤸</Text>;
    case "Dance":
      return <Text style={styles.sportIcon}>💃</Text>;
    case "Archery":
      return <Text style={styles.sportIcon}>🏹</Text>;
    case "Yoga":
      return <Text style={styles.sportIcon}>🧘</Text>;
    default:
      return null;
  }
};

// Mock API function to generate bookings
const generateBookings = (startDate: Date, count: number): Booking[] => {
  const sports: Sport[] = ["Acrobatics", "Dance", "Archery", "Yoga"];
  const bookings: Booking[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    // Randomly decide how many bookings for this date (1-3)
    const bookingsForDate = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < bookingsForDate; j++) {
      // Random sport
      const sport = sports[Math.floor(Math.random() * sports.length)];

      // Random start time (5-minute intervals)
      const startHour = Math.floor(Math.random() * 24);
      const startMinute = Math.floor(Math.random() * 12) * 5; // 5-minute intervals

      const startDateTime = new Date(currentDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      // Random end time (after start time, 5-minute intervals)
      const remainingMinutesInDay = (23 - startHour) * 60 + (55 - startMinute);
      const endMinutesAfterStart = Math.min(
        Math.floor((Math.random() * remainingMinutesInDay) / 5) * 5 + 5, // At least 5 minutes
        remainingMinutesInDay
      );

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(startDateTime.getMinutes() + endMinutesAfterStart);

      bookings.push({
        id: `${i}-${j}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        sport,
        startDateTime,
        endDateTime,
      });
    }

    // Move to next date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return bookings;
};

const formatTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userData = useMemo(() => {
    const state = useAuthStore.getState();
    return {
      user: state.user,
    };
  }, []);

  // Initial load of bookings
  useEffect(() => {
    loadInitialBookings();
  }, []);

  const loadInitialBookings = useCallback(() => {
    setLoading(true);
    const startDate = new Date(2024, 11, 16); 
    const initialBookings = generateBookings(startDate, 10);
    setBookings(initialBookings);
    setLoading(false);
  }, []);

  const loadMoreBookings = useCallback(() => {
    if (loading) return;

    setLoading(true);
    // Get the last date from current bookings and add one day
    const lastBooking = bookings[bookings.length - 1];
    if (!lastBooking) {
      setLoading(false);
      return;
    }

    const lastDate = new Date(lastBooking.startDateTime);
    lastDate.setDate(lastDate.getDate() + 1);

    const newBookings = generateBookings(lastDate, 25);
    setBookings((prev) => [...prev, ...newBookings]);
    setLoading(false);
  }, [bookings, loading]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialBookings();
    setRefreshing(false);
  }, [loadInitialBookings]);

  const sectionedBookings = useMemo(() => {
    const sections: Record<string, Booking[]> = {};

    bookings.forEach((booking) => {
      const dateStr = format(booking.startDateTime, "dd/MM/yyyy");
      if (!sections[dateStr]) {
        sections[dateStr] = [];
      }
      sections[dateStr].push(booking);
    });

    return Object.entries(sections).map(([date, data]) => ({
      title: date,
      data,
    }));
  }, [bookings]);

  const handleLogout = useCallback(() => {
    useAuthStore.getState().logout();
    // The AuthenticationGuard in _layout.tsx will automatically redirect to login
  }, []);

  const renderBookingItem = useCallback(
    ({ item }: { item: Booking }) => (
      <View style={styles.bookingItem}>
        <View style={styles.sportContainer}>
          <SportIcon sport={item.sport} />
          <Text style={styles.sportText}>{item.sport}</Text>
        </View>
        <Text style={styles.timeText}>
          {formatTime(item.startDateTime)} - {formatTime(item.endDateTime)}
        </Text>
      </View>
    ),
    []
  );

  // Render a section header
  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    ),
    []
  );

  // Render the footer (loading indicator)
  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }, [loading]);
  console.log('hello')

  return (
    <View style={styles.container}>
      <FlatList
        data={sectionedBookings}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{item.title}</Text>
            </View>
            {item.data.map((booking) => renderBookingItem({ item: booking }))}
          </View>
        )}
        onEndReached={loadMoreBookings}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  sectionHeader: {
    backgroundColor: "#FFF8F2",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE8D6",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
  },
  sportContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sportIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sportText: {
    fontSize: 16,
    fontWeight: "500",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
