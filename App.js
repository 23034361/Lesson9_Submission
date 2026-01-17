import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";

const App = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = "https://music-playlist-186g.onrender.com/songs";

  // 🎵 Get album cover based on song ID (random colorful images)
  const getAlbumCover = (title, id) => {
    // Using Picsum Photos for random images
    return `https://picsum.photos/seed/${id}/200/200`;
  };

  // 🔹 Fetch data ONCE
  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        let arrayData = [];

        // ✅ Ensure array no matter what API returns
        if (Array.isArray(json)) {
          arrayData = json;
        } else if (Array.isArray(json.songs)) {
          arrayData = json.songs;
        }

        setOriginalData(arrayData);
        setData(arrayData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  // 🔹 Case-insensitive search
  const filterData = (text) => {
    if (!text) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );

    setData(filtered);
  };

  // 🔹 Display each song with album cover
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: getAlbumCover(item.title, item.id) }}
        style={styles.albumCover}
      />
      <View style={styles.songInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
        <Text style={styles.duration}>{item.duration} min</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading playlist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🎵 Music Playlist</Text>
        <Text style={styles.subtitle}>{data.length} songs</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="🔍 Search by song title..."
        placeholderTextColor="#B3B3B3"
        onChangeText={filterData}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default App;

// 🔹 Enhanced Styles with Spotify-like theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
    paddingTop: 50
  },
  centered: {
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: {
    marginBottom: 20
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1DB954",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: "#B3B3B3"
  },
  loadingText: {
    marginTop: 10,
    color: "#B3B3B3"
  },
  search: {
    borderWidth: 1,
    borderColor: "#282828",
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#282828",
    color: "#FFFFFF",
    fontSize: 16
  },
  card: {
    backgroundColor: "#282828",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  albumCover: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#404040"
  },
  songInfo: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4
  },
  artist: {
    fontSize: 14,
    color: "#B3B3B3",
    marginBottom: 4
  },
  duration: {
    fontSize: 12,
    color: "#1DB954"
  }
});