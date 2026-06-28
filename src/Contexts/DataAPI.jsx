import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generate } from "short-uuid";
import { useToastsContext } from "./ToastsContext";

const dataApiContext = createContext();

export const DataApiProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingAuth, setPendingAuth] = useState(true);
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const { addToast, deleteToast } = useToastsContext();
  const nav = useNavigate();
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  const getStatus = async () => {
    const toastId = addToast("loading", "Validating session...");
    console.log("ID", toastId);

    try {
      const res = await api.get("/users/status");
      console.log(res.data.userInfo);

      setUser(res.data.userInfo);
      addToast("success", "Logged in successfully");

      nav("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setPendingAuth(false);
      deleteToast(toastId);
    }
  };
  const logIn = async (data) => {
    const toastId = addToast("loading", "Logging in...");

    try {
      const res = await api.post("/users/signin", data);
      setUser(res.data.user);
      nav("/dashboard");
      addToast("success", "Logged in successfully");
    } catch (error) {
      throw error.response.data;
    } finally {
      deleteToast(toastId);
    }
  };

  const signUp = async (data) => {
    const toastId = addToast("loading", "Signing up...");
    try {
      await api.post("/users/signup", data);
      nav("/signin");
      addToast("success", "User has been registered successfully");
    } catch (error) {
      addToast("error", error.response.data || "Could not sign up");
      throw error.response.data;
    } finally {
      deleteToast(toastId);
    }
  };

  const logOut = async () => {
    const toastId = addToast("loading", "Signing out, Bye Bye...");

    try {
      await api.post("/users/signout");
      setUser(null);
      nav("/");
      addToast("success", "Signed out successfully");
    } catch (error) {
      addToast("error", "Could not sign out");
      throw error.response.data;
    } finally {
      deleteToast(toastId);
    }
  };
  const getTodos = async () => {
    const toastId = addToast("loading", "Fetching todos...");
    setLoadingTodos(true);
    try {
      const res = await api.get("/todos");
      setTodos(res.data);
      addToast("success", "Fetched todos successfully");
    } catch (error) {
      addToast("error", "Could not fetch todos");
      console.log(error);
    } finally {
      deleteToast(toastId);
      setLoadingTodos(false);
    }
  };
  const addTodo = async (data) => {
    const toastId = addToast("loading", "Adding todo...");
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
      addToast("success", "Added todo successfully");
    } catch (error) {
      addToast("error", "Could not add a new todo");
      setTodos(tempTodos);
      throw error.response.data;
    } finally {
      deleteToast(toastId);
    }
  };
  const editTodo = async (id, data) => {
    const toastId = addToast("loading", "Editing todo...");
    console.log(id);
    const tempTodos = todos;
    try {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...data } : todo)),
      );
      await api.put(`/todos/${id}`, data);
      addToast("success", "Edited todo successfully");
    } catch (error) {
      addToast("error", "Could not edit todo");
      setTodos(tempTodos);
      throw error.response.data;
    } finally {
      deleteToast(toastId);
    }
  };
  const deleteTodo = async (id) => {
    const toastId = addToast("loading", "Deleting todo...");
    const tempTodos = todos;
    setTodos((prev) => prev.filter((todo) => todo.id != id));
    try {
      await api.delete(`/todos/${id}`);
      addToast("success", "Deleted todo successfully");
    } catch (error) {
      addToast("error", "Could not delete todo");
      setTodos(tempTodos);
      throw error.response.data;
    } finally {
      deleteToast(toastId);
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
