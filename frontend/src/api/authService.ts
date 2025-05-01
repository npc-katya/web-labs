export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const userData = { name, email, password };

  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("ошибка при регистрации");
  }

  return await response.json();
};

export const loginUser = async (email: string, password: string) => {
  const userData = { email, password };

  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("ошибка при входе");
  }

  return await response.json();
};

export const logoutUser = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};
