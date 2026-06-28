import React from "react";
import { useToastsContext } from "../Contexts/ToastsContext";
import { CgSearchLoading } from "react-icons/cg";
import { MdDone, MdDoneAll } from "react-icons/md";
import { BiError } from "react-icons/bi";

const Toast = () => {
  const { toasts } = useToastsContext();
  return (
    <div className="custom-toastt-container">
      <div className="custom-toast">
        {toasts.map((toast) => (
          <div className="toast-message-container d-flex justify-content-center align-items-center gap-2">
            {toast.status == "loading" ? (
              <CgSearchLoading size={25} color="lightyellow" />
            ) : toast.status == "success" ? (
              <MdDoneAll size={25} color="lightgreen" />
            ) : (
              <BiError size={25} color="red" />
            )}
            <li key={toast.id}>{toast.message}</li>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toast;
