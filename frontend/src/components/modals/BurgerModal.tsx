import React, { RefObject } from "react";
import styles from "./Modals.module.scss";

interface BurgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleHome: () => void;
  handleEvents: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

const BurgerModal: React.FC<BurgerModalProps> = ({
  isOpen,
  onClose,
  handleHome,
  handleEvents,
  modalRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modal}>
        <button onClick={onClose} className={styles.modalCloseButton}></button>
        <h2>куда хотите перейти?</h2>
        <button onClick={handleHome} className={styles.modalButton}>
          главная
        </button>
        <button onClick={handleEvents} className={styles.modalButton}>
          список мероприятий
        </button>
      </div>
    </div>
  );
};

export default BurgerModal;
