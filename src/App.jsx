import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import { useLocation, Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./Pages/Index";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import ManageTodos from "./Pages/ManageTodos";
import PrivateRoutes from "./Components/PrivateRoutes";
import Navbar from "./Components/Navbar";

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const prevLocationRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start fade out animation
      prevLocationRef.current = displayLocation;
      setTransitionStage("fadeOut");

      // After fade out completes, set new page and fade in
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 200);
    }
  }, [location, displayLocation]);

  return (
    <>
      <Navbar />
      <div
        className={`page page-${transitionStage}`}
        style={{
          minHeight: "calc(100vh - 64px)",
          transform: "none !important",
        }}
      >
        <RouterRoutes location={displayLocation}>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage" element={<ManageTodos />} />
          </Route>
        </RouterRoutes>
      </div>
    </>
  );
}

export default App;
