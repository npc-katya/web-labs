import { forwardRef } from "react";
import styles from "./Modals.module.scss";

type Props = {
  handleDelete: () => void;
  closeDeleteConfirm: () => void;
  closeActionsModal: () => void;
};

const ModalDeleteConfirm = forwardRef<HTMLDivElement, Props>(
  ({ handleDelete, closeDeleteConfirm, closeActionsModal }, ref) => {
    return (
      <div className={styles.modalOverlay}>
        <div ref={ref} className={styles.modal} onClick={closeActionsModal}>
          <h2>подтверждение удаления</h2>
          <p>вы уверены, что хотите удалить событие?</p>
          <div>
            <button onClick={handleDelete} className={styles.modalButton}>
              да, удалить
            </button>
            <button
              onClick={closeDeleteConfirm}
              className={styles.modalCloseButton}
            ></button>
          </div>
        </div>
      </div>
    );
  },
);

export default ModalDeleteConfirm;
