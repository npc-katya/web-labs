import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { UserService } from "./userService";
import { useNavigate } from "react-router-dom";

export const useUserLogic = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    id: number | null;
    token: string | null;
  }>({
    name: "",
    email: "",
    id: null,
    token: null,
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // функция удаления куки
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setUserData((prev) => ({ ...prev, token: null, id: null }));
    navigate("/login", { replace: true });
  };

  // проверка и получение токена из cookie
  const getTokenFromCookie = (): string | null => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  // проверка валидности токена
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // получение данных пользователя
  const fetchUserData = async (token: string) => {
    try {
      if (!isTokenValid(token)) {
        throw new Error("токен истёк");
      }

      const decoded: any = jwtDecode(token);
      const userService = new UserService(token);
      const user = await userService.fetchUserById(decoded.id);

      if (user) {
        setUserData({
          name: user.name,
          email: user.email,
          id: user.id,
          token: token,
        });
      }
    } catch (error) {
      console.error("ошибка при загрузке данных:", error);

      deleteCookie("token");
      setUserData((prev) => ({ ...prev, token: null, id: null }));

      if (error instanceof Error) {
        setMessage(
          error.message.includes("404")
            ? "пользователь не найден"
            : `ошибка: ${error.message}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      if (isTokenValid(token)) {
        fetchUserData(token);
      } else {
        deleteCookie("token");
        setMessage("сессия истекла. пожалуйста, войдите снова");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    userData,
    setUserData,
    message,
    isLoading,
  };
};
