import React, { forwardRef } from "react";
import styles from "./Modals.module.scss";
import { Gender } from "../../types/user";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  profileData: {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    gender: Gender;
    dateOfBirth: Date;
  };
  profileErrors: { [key: string]: string };
  profileStatus: string | null;
  isSaving: boolean;
  handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBirthDateChange: (date: Date) => void;
};

const UserProfileModal = forwardRef<HTMLDivElement, Props>(
  (
    {
      isOpen,
      onClose,
      onSubmit,
      profileData,
      profileErrors,
      profileStatus,
      isSaving,
      handleFieldChange,
      handleGenderChange,
      handleBirthDateChange,
    },
    ref,
  ) => {
    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal} ref={ref}>
          <h2>редактирование профиля</h2>
          <form className={styles.userForm} onSubmit={onSubmit}>
            <div>
              <label>имя:</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleFieldChange}
                required
                className={styles.modalInput}
              />
              {profileErrors.name && (
                <div className={styles.error}>{profileErrors.name}</div>
              )}
            </div>

            <div>
              <label>фамилия:</label>
              <input
                type="text"
                name="surname"
                value={profileData.surname}
                onChange={handleFieldChange}
                required
                className={styles.modalInput}
              />
            </div>

            <div>
              <label>отчество:</label>
              <input
                type="text"
                name="patronymic"
                value={profileData.patronymic}
                onChange={handleFieldChange}
                className={styles.modalInput}
              />
            </div>

            <div>
              <label>почта:</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleFieldChange}
                required
                className={styles.modalInput}
              />
              {profileErrors.email && (
                <div className={styles.error}>{profileErrors.email}</div>
              )}
            </div>

            <div>
              <label>пол:</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleGenderChange}
                className={styles.formSelect}
              >
                <option value="male">мужской</option>
                <option value="female">женский</option>
                <option value="other">другой</option>
                <option value="not specified">не указан</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Дата рождения:</label>
              <input
                type="date"
                value={
                  new Date(profileData.dateOfBirth).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  handleBirthDateChange(new Date(e.target.value))
                }
                className={styles.formInput}
              />
            </div>

            <div className={styles.formButtons}>
              <button
                type="submit"
                className={styles.modalButton}
                disabled={isSaving}
              >
                {isSaving ? "сохранение..." : "сохранить"}
              </button>
            </div>
          </form>
          <button
            onClick={onClose}
            className={styles.modalCloseButton}
          ></button>
          {profileStatus && (
            <div className={styles.message}>{profileStatus}</div>
          )}
        </div>
      </div>
    );
  },
);

export default UserProfileModal;
