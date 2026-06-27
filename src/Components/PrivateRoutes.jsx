import React, { useEffect, useState } from "react";
import { useDataApi } from "../Contexts/DataAPI";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { pendingAuth, user } = useDataApi();
  const [countdown, setCountDown] = useState(5);
  const nav = useNavigate();
  useEffect(() => {
    if (pendingAuth) return;
    let timer = null;
    if (!user) {
      timer = setInterval(() => {
        setCountDown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      setTimeout(() => {
        nav("/signin");
      }, 4500);
    }
    return () => {
      setCountDown(5);
      clearInterval(timer);
    };
  }, [pendingAuth, user]);

  return !user ? (
    <div className="custom-center-content">
      <div className="custom-warning-alert">
        Please log in first to view this page, redirecting to sign in in{" "}
        {countdown}s...
      </div>
    </div>
  ) : (
    <Outlet>{children}</Outlet>
  );
};

export default PrivateRoutes;
