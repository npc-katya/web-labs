import React, { RefObject } from "react";
import styles from "./Modals.module.scss";
import { UserData } from "../../types/user";

interface LoginModalProps {
  userData: UserData;
  isOpen: boolean;
  onClose: () => void;
  handleLogin: () => void;
  handleRegister: () => void;
  handleLogout: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

const LoginModal: React.FC<LoginModalProps> = ({
  userData,
  isOpen,
  onClose,
  handleLogin,
  handleRegister,
  handleLogout,
  modalRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modal}>
        <button onClick={onClose} className={styles.modalCloseButton}></button>

        <h2>
          {userData.token
            ? `здравствуйте, ${userData.name}`
            : "здравствуйте, гость"}
        </h2>
        <h3>
          {userData.token ? "хотите выйти?" : "что бы вы хотели сделать?"}
        </h3>

        <div>
          {userData.token ? (
            <button onClick={handleLogout} className={styles.modalButton}>
              выйти
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className={styles.modalButton}>
                войти
              </button>
              <button onClick={handleRegister} className={styles.modalButton}>
                зарегистрироваться
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
