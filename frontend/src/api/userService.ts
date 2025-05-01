export interface User {
  id: number | null;
  name: string;
  email: string;
  password: string;
}

export class UserService {
  private token: string | null = null;

  constructor(token: string | null) {
    this.token = token;
  }

  // получение всех пользователей
  public async fetchUsers(): Promise<User[]> {
    if (!this.token) return [];

    try {
      const response = await fetch("http://localhost:8080/protected/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `ошибка при получении пользователей: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // получение пользователя по ID
  public async fetchUserById(userId: number): Promise<User> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `ошибка при получении пользователя с ID ${userId}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // создание пользователя
  public async createUser(userData: Omit<User, "id">): Promise<User> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch("http://localhost:8080/protected/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`сетевая ошибка: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // обновление пользователя
  public async updateUser(
    userId: number,
    userData: Omit<User, "id" | "password">,
  ): Promise<User> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`сетевая ошибка: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }

  // удаление пользователя
  public async deleteUser(userId: number): Promise<void> {
    if (!this.token) throw new Error("токен отсутствует");

    try {
      const response = await fetch(
        `http://localhost:8080/protected/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `сетевая ошибка при удалении пользователя с ID ${userId}: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("ошибка:", error);
      throw error;
    }
  }
}
