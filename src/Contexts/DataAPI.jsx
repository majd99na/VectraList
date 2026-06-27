import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { generate } from "short-uuid";

const dataApiContext = createContext();

export const DataApiProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingAuth, setPendingAuth] = useState(true);
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  const getStatus = async () => {
    try {
      const res = await api.get("/users/status");
      console.log(res.data.userInfo);

      setUser(res.data.userInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setPendingAuth(false);
    }
  };
  const logIn = async (data) => {
    try {
      const res = await api.post("/users/signin", data);
      setUser(res.data.user);
    } catch (error) {
      throw error.response.data;
    }
  };

  const signUp = async (data) => {
    try {
      await api.post("/users/signup", data);
    } catch (error) {
      throw error.response.data;
    }
  };

  const logOut = async () => {
    try {
      await api.post("/users/signout");
      setUser(null);
    } catch (error) {
      throw error.response.data;
    }
  };
  const getTodos = async () => {
    setLoadingTodos(true);
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTodos(false);
    }
  };
  const addTodo = async (data) => {
    const tempTodos = todos;
    const id = generate();
    setTodos([
      ...todos,
      {
        created_at: new Date().toISOString().split("T")[0],
        id,
        ...data,
        status: "Pending",
      },
    ]);
    try {
      await api.post("/todos", { ...data, id });
    } catch (error) {
      setTodos(tempTodos);
      throw error.response.data;
    }
  };
  const editTodo = async (id, data) => {
    console.log(id);
    const tempTodos = todos;
    try {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo)),
      );
      await api.put(`/todos/${id}`, data);
    } catch (error) {
      setTodos(tempTodos);
      throw error.response.data;
    }
  };
  const deleteTodo = async (id) => {
    const tempTodos = todos;
    setTodos((prev) => prev.filter((todo) => todo.id != id));
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      setTodos(tempTodos);
      throw error.response.data;
    }
  };

  useEffect(() => {
    getStatus();
  }, []);
  useEffect(() => {
    if (!user) return;
    getTodos();
  }, [user]);
  return (
    <dataApiContext.Provider
      value={{
        pendingAuth,
        user,
        logIn,
        signUp,
        logOut,
        addTodo,
        editTodo,
        deleteTodo,
        todos,
        loadingTodos,
      }}
    >
      {children}
    </dataApiContext.Provider>
  );
};

export const useDataApi = () => useContext(dataApiContext);
