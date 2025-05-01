import { forwardRef } from "react";
import styles from "./Modals.module.scss";
import { EventWithCreator } from "../../types/extendedEvent";

type Props = {
  selectedEvent: EventWithCreator;
  currentUser: { id: number | null };
  showEventOnMap: (id: number, coordinates: number[]) => void;
  openEditModal: (event: EventWithCreator) => void;
  openDeleteConfirm: () => void;
  closeActionsModal: () => void;
};

const ActionsModal = forwardRef<HTMLDivElement, Props>(
  (
    {
      selectedEvent,
      currentUser,
      showEventOnMap,
      openEditModal,
      openDeleteConfirm,
      closeActionsModal,
    },
    ref,
  ) => {
    return (
      <div className={styles.modalOverlay}>
        <div ref={ref} className={styles.modal}>
          <h2>действия</h2>
          <div>
            <button
              onClick={() =>
                showEventOnMap(selectedEvent.id, selectedEvent.coordinates)
              }
              className={styles.modalButton}
            >
              показать на карте
            </button>

            {selectedEvent.createdBy === currentUser.id && (
              <>
                <button
                  onClick={() => openEditModal(selectedEvent)}
                  className={styles.modalButton}
                >
                  редактировать
                </button>
                <button
                  onClick={openDeleteConfirm}
                  className={styles.modalButton}
                >
                  удалить
                </button>
              </>
            )}

            <button
              onClick={closeActionsModal}
              className={styles.modalCloseButton}
            ></button>
          </div>
        </div>
      </div>
    );
  },
);

export default ActionsModal;
