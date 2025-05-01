export interface UserData {
  id: number | null;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  token: string | null;
}

export type Gender = "male" | "female" | "other" | "not specified";

export interface User {
  id: number | null;
  name: string;
  surname: string;
  patronymic: string;
  gender: Gender;
  dateOfBirth: Date;
  email: string;
  password: string;
}
