import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home/HomePage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import Events from "./pages/Events/EventsPage";
import NotFound from "./pages/NotFound/NotFoundPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
