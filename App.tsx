import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

import { supabase } from "./lib/supabase";

type movies = {
  id: number;
  genero: string;
  titulo: string;
  sinopse: string;
  ano_lancamento: number;
  tmbd_id: number;
};

export default function App() {
  const [movies, setMovies] = useState<movies[]>([]);

  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [anoLancamento, setAnoLancamento] = useState("");
  const [tmdbId, setTmdbId] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function loadMovies() {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("id");

    if (error) {
      console.log("Erro ao buscar filmes:", error);
      return;
    }

    setMovies(data);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  async function salvarFilme() {
    if (!titulo || !genero || !anoLancamento || !tmdbId) {
      console.log("Preencha os campos obrigatórios");
      return;
    }

    if (editandoId !== null) {
      const { error } = await supabase
        .from("movies")
        .update({
          titulo: titulo,
          genero: genero,
          sinopse: sinopse,
          ano_lancamento: Number(anoLancamento),
          tmbd_id: Number(tmdbId),
        })
        .eq("id", editandoId);

      if (error) {
        console.log("Erro ao editar:", error);
        return;
      }

      setEditandoId(null);
    } else {
      const { error } = await supabase
        .from("movies")
        .insert({
          titulo: titulo,
          genero: genero,
          sinopse: sinopse,
          ano_lancamento: Number(anoLancamento),
          tmbd_id: Number(tmdbId),
        });

      if (error) {
        console.log("Erro ao adicionar:", error);
        return;
      }
    }

    limparFormulario();
    loadMovies();
  }

  async function deletarFilme(id: number) {
    const { error } = await supabase
      .from("movies")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Erro ao deletar:", error);
      return;
    }

    loadMovies();
  }

  function editarFilme(movie: movies) {
    setEditandoId(movie.id);

    setTitulo(movie.titulo);
    setGenero(movie.genero);
    setSinopse(movie.sinopse);
    setAnoLancamento(movie.ano_lancamento.toString());
    setTmdbId(movie.tmbd_id.toString());
  }

  function limparFormulario() {
    setTitulo("");
    setGenero("");
    setSinopse("");
    setAnoLancamento("");
    setTmdbId("");
    setEditandoId(null);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Meus filmes
      </Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {editandoId !== null
            ? "Editar filme"
            : "Adicionar filme"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#777"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Gênero"
          placeholderTextColor="#777"
          value={genero}
          onChangeText={setGenero}
        />

        <TextInput
          style={styles.input}
          placeholder="Sinopse"
          placeholderTextColor="#777"
          value={sinopse}
          onChangeText={setSinopse}
        />

        <TextInput
          style={styles.input}
          placeholder="Ano de lançamento"
          placeholderTextColor="#777"
          value={anoLancamento}
          onChangeText={setAnoLancamento}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="TMDB ID"
          placeholderTextColor="#777"
          value={tmdbId}
          onChangeText={setTmdbId}
          keyboardType="numeric"
        />

        <Pressable
          style={styles.addButton}
          onPress={salvarFilme}
        >
          <Text style={styles.buttonText}>
            {editandoId !== null
              ? "Salvar alterações"
              : "Adicionar filme"}
          </Text>
        </Pressable>

        {editandoId !== null && (
          <Pressable
            style={styles.cancelButton}
            onPress={limparFormulario}
          >
            <Text style={styles.buttonText}>
              Cancelar
            </Text>
          </Pressable>
        )}
      </View>

      {movies.map((movie) => (
        <View key={movie.id} style={styles.movie}>
          <Text style={styles.movieTitle}>
            {movie.titulo}
          </Text>

          <Text style={styles.genre}>
            {movie.genero}
          </Text>

          <Text style={styles.year}>
            {movie.ano_lancamento}
          </Text>

          <Text style={styles.synopsis}>
            {movie.sinopse}
          </Text>

          <Text style={styles.id}>
            ID: {movie.id}
          </Text>

          <View style={styles.actions}>
            <Pressable
              style={styles.editButton}
              onPress={() => editarFilme(movie)}
            >
              <Text style={styles.buttonText}>
                Editar
              </Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => deletarFilme(movie.id)}
            >
              <Text style={styles.buttonText}>
                Deletar
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
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
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
  },

  form: {
    backgroundColor: "#1f252b",
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },

  formTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#14181c",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: "#00e054",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  cancelButton: {
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  movie: {
    backgroundColor: "#1f252b",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  movieTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  genre: {
    color: "#00e054",
    fontSize: 14,
    marginBottom: 5,
  },

  year: {
    color: "#8899a6",
    fontSize: 14,
    marginBottom: 12,
  },

  synopsis: {
    color: "#c5cbd0",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },

  id: {
    color: "#66737d",
    fontSize: 12,
    marginBottom: 15,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#3578e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#e53935",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
