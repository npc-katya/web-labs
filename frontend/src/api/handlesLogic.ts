import { useNavigate } from "react-router-dom";
import { logoutUser } from "./authService";
import { useUserLogic } from "./userLogic";

export const useHandlesLogic = () => {
  const { setUserData } = useUserLogic();

  const navigate = useNavigate();

  // обработчики навигации
  const handleHome = () => navigate("/");
  const handleEvents = () => navigate("/events");
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = () => {
    logoutUser();
    setUserData({
      name: "",
      surname: "",
      patronymic: "",
      email: "",
      gender: "not specified",
      dateOfBirth: new Date(0),
      id: null,
      token: null,
    });
    window.location.reload();
    handleHome();
  };

  return {
    handleHome,
    handleLogin,
    handleRegister,
    handleEvents,
    handleLogout,
  };
};
