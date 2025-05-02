import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import Events from "./pages/Events/EventsPage";
import NotFound from "./pages/NotFound/NotFoundPage";
import User from "./pages/User/UserPage";
import { ProtectedRoute } from "./ProtectedRoute";

import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { initializeAuthFromCookie } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuthFromCookie());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* защищенный маршрут */}
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
