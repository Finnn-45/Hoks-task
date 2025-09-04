import React, { useState, useEffect, useContext, createContext, useReducer, useMemo } from "react";
import "./App.css";

/* ======================
   1. Counter dengan Reset
====================== */
function Counter() {
  const [count, setCount] = useState(0); // bikin state buat angka counter
  return (
    <section>
      <h2>Ini Counter: {count}</h2>
      {/* tombol nambahin angka */}
      <button onClick={() => setCount(count + 1)}>Tambah</button>
      {/* tombol balikin angka ke 0 */}
      <button onClick={() => setCount(0)}>Reset</button>
    </section>
  );
}

/* ======================
   2. Fetch Data dengan useEffect
====================== */
function FetchData() {
  const [data, setData] = useState([]); // state buat nyimpen data dari API

  useEffect(() => {
    // ambil data dari API
    fetch("https://jsonplaceholder.typicode.com/users") // jangan lupa isi URL API
      .then((res) => res.json())
      .then((result) => setData(result)) // simpen ke state
      .catch((err) => console.error(err)); // kalo error, tampilkan di console
  }, []); // jalan sekali pas komponen pertama kali render

  return (
    <section>
      <h2>Data Users</h2>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {/* looping data user */}
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ======================
   3. useContext buat Tema
====================== */
const ThemeContext = createContext(); // bikin context kosong

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // light/dark mode

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light")); // switch tema

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedBox() {
  const { theme, toggleTheme } = useContext(ThemeContext); // ambil data dari context
  return (
    <section className={theme === "light" ? "light" : "dark"}>
      <p>Tampilan Sekarang: {theme}</p>
      <button onClick={toggleTheme}>Buat ganti tema</button>
    </section>
  );
}

/* ======================
   4. useReducer untuk Form
====================== */
const initialForm = { name: "", email: "" }; // data awal form

// reducer buat atur perubahan state
function formReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_EMAIL":
      return { ...state, email: action.value };
    case "RESET":
      return initialForm;
    default:
      return state;
  }
}

function FormReducer() {
  const [state, dispatch] = useReducer(formReducer, initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Nama: ${state.name}, Email: ${state.email}`);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        {/* input nama */}
        <input
          type="text"
          placeholder="Nama"
          value={state.name}
          onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
        />

        {/* input email */}
        <input
          type="email"
          placeholder="Email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "SET_EMAIL", value: e.target.value })
          }
        />

        <button type="submit">Submit</button>
        <button type="button" onClick={() => dispatch({ type: "RESET" })}>
          Reset
        </button>
      </form>
    </section>
  );
}

/* ======================
   5. useMemo untuk Optimasi
====================== */
function expensiveCalculation(num) {
  console.log("Menghitung...");
  let total = 0;
  for (let i = 0; i < 10; i++) {
    total += num; // loop biar keliatan "berat"
  }
  return total;
}

function MemoExample() {
  const [number, setNumber] = useState(0); // angka yang dihitung
  const [text, setText] = useState(""); // input teks biasa

  // pake useMemo biar hitungan cuma jalan kalo number berubah
  const calculation = useMemo(() => expensiveCalculation(number), [number]);

  return (
    <section>
      {/* input angka */}
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
      />

      {/* input teks biasa */}
      <input
        type="text"
        placeholder="Ketik sesuatu"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p>Hasil perhitungan: {calculation}</p>
    </section>
  );
}

/* ======================
   6. Custom Hook untuk Form
====================== */
function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return { values, handleChange, handleSubmit };
}

function FormWithHook() {
  const { values, handleChange, handleSubmit } = useForm(
    { username: "", password: "" },
    (formValues) => {
      alert(
        `Username: ${formValues.username}, Password: ${formValues.password}`
      );
    }
  );

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </section>
  );
}

/* ======================
   App.jsx Utama
====================== */
export default function App() {
  return (
    <ThemeProvider>
      <div className="container">
        <h1>🚀 React Hooks Demo</h1>
        <Counter /> {/* contoh useState */}
        <FetchData /> {/* contoh useEffect */}
        <ThemedBox /> {/* contoh useContext */}
        <FormReducer /> {/* contoh useReducer */}
        <MemoExample /> {/* contoh useMemo */}
        <FormWithHook /> {/* contoh custom hook */}
      </div>
    </ThemeProvider>
  );
}
