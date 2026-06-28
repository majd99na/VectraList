import { createContext, useContext, useEffect, useState } from "react";
import { generate } from "short-uuid";

const toastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let timer = null;
    if (toasts.length > 0) {
      timer = setTimeout(() => {
        setToasts((prev) =>
          prev.filter(
            (toast) => toast.status !== "error" && toast.status !== "success",
          ),
        );
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [toasts]);
  const addToast = (status, message) => {
    const id = generate();
    setToasts((prev) => [...prev, { id, status, message }]);
    return id;
  };
  const deleteToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return (
    <toastContext.Provider value={{ toasts, addToast, deleteToast }}>
      {children}
    </toastContext.Provider>
  );
};

export const useToastsContext = () => useContext(toastContext);
