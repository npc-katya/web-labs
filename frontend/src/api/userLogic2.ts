import { useState, useEffect } from "react";
import { UserService } from "./userService";
import { User, Gender } from "../types/user";

export const useProfileManager = (
  initialProfileData: Omit<User, "password">,
  authToken: string | null,
) => {
  const userService = new UserService(authToken);

  useEffect(() => {
    setProfileEditData({
      name: initialProfileData.name,
      surname: initialProfileData.surname,
      patronymic: initialProfileData.patronymic,
      email: initialProfileData.email,
      gender: initialProfileData.gender,
      dateOfBirth: initialProfileData.dateOfBirth,
    });
  }, [initialProfileData]);

  // состояние формы
  const [profileEditData, setProfileEditData] = useState<
    Omit<User, "id" | "password">
  >({
    name: initialProfileData.name,
    surname: initialProfileData.surname,
    patronymic: initialProfileData.patronymic,
    email: initialProfileData.email,
    gender: initialProfileData.gender,
    dateOfBirth: initialProfileData.dateOfBirth,
  });

  // состояние UI
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<string | null>(
    null,
  );
  const [profileValidationErrors, setProfileValidationErrors] = useState<
    Record<string, string>
  >({});

  // обработчики изменений
  const updateProfileField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileEditData((prev) => ({ ...prev, [name]: value }));

    if (profileValidationErrors[name]) {
      setProfileValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const updateProfileGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileEditData((prev) => ({
      ...prev,
      gender: e.target.value as Gender,
    }));
  };

  const updateProfileBirthDate = (date: Date | null) => {
    if (date) {
      setProfileEditData((prev) => ({ ...prev, dateOfBirth: date }));
    }
  };

  // валидация
  const checkProfileValidity = (): boolean => {
    const validationIssues: Record<string, string> = {};

    if (!profileEditData.name.trim()) validationIssues.name = "Имя обязательно";
    if (!profileEditData.email.includes("@"))
      validationIssues.email = "Некорректный email";
    if (!profileEditData.dateOfBirth)
      validationIssues.dateOfBirth = "Укажите дату рождения";

    setProfileValidationErrors(validationIssues);
    return Object.keys(validationIssues).length === 0;
  };

  // отправка формы
  const processProfileUpdate = async () => {
    console.log("Profile data to update:", profileEditData);
    console.log("User ID:", initialProfileData.id);

    if (!checkProfileValidity()) return false;
    if (!authToken) {
      setProfileUpdateStatus("Требуется авторизация");
      return false;
    }

    setIsProfileSaving(true);
    setProfileUpdateStatus(null);

    try {
      if (initialProfileData.id == null) {
        setProfileUpdateStatus(
          "Не удалось определить пользователя для обновления",
        );
        return false;
      }

      const updatedProfile = await userService.updateUser(
        initialProfileData.id,
        profileEditData,
      );

      setProfileUpdateStatus("Данные профиля сохранены");
      return updatedProfile;
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      setProfileUpdateStatus(
        error instanceof Error ? error.message : "Ошибка сохранения",
      );
      throw error;
    } finally {
      setIsProfileSaving(false);
    }
  };

  // сброс формы
  const restoreProfileForm = () => {
    setProfileEditData({
      name: initialProfileData.name || "",
      surname: initialProfileData.surname || "",
      patronymic: initialProfileData.patronymic || "",
      email: initialProfileData.email || "",
      gender: initialProfileData.gender || "not specified",
      dateOfBirth: initialProfileData.dateOfBirth
        ? new Date(initialProfileData.dateOfBirth)
        : new Date(0),
    });
    setProfileValidationErrors({});
    setProfileUpdateStatus(null);
  };

  return {
    profileData: profileEditData,
    profileErrors: profileValidationErrors,
    profileStatus: profileUpdateStatus,
    isSaving: isProfileSaving,
    handleFieldChange: updateProfileField,
    handleGenderChange: updateProfileGender,
    handleBirthDateChange: updateProfileBirthDate,
    saveProfile: processProfileUpdate,
    resetProfileForm: restoreProfileForm,
    setProfileData: setProfileEditData,
  };
};
