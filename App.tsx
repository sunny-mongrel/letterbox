import { useEffect, useState } from "react";
import {View,Text,FlatList,StyleSheet,ActivityIndicator,} from "react-native";
import {supabase} from "./lib/supabase.js"
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

type Movie = {
  id: number;
  tmdb_id: number;
  title: string;
  release_year: number | null;
  synopsis: string | null;
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("title");

    if (error) {
      console.log("Erro ao buscar filmes:", error);
      return;
    }

    setMovies(data || []);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus filmes</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00e054"
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movie}>
              <Text style={styles.movieTitle}>
                {item.title}
              </Text>

              {item.release_year && (
                <Text style={styles.year}>
                  {item.release_year}
                </Text>
              )}

              {item.synopsis && (
                <Text style={styles.synopsis}>
                  {item.synopsis}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14181c",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },

  movie: {
    backgroundColor: "#1f252b",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  movieTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },

  year: {
    color: "#00e054",
    fontSize: 15,
    marginTop: 5,
  },

  synopsis: {
    color: "#9ab",
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
});
