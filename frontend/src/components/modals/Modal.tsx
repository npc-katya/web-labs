import React, { RefObject } from "react";
import styles from "./Modals.module.scss";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { EventType } from "../../types/EventType";

interface FormData {
  title: string;
  date: Date;
  location: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  selectedEvent: EventType | null;
  handleSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleInputMethod: () => void;
  inputMethod: "map" | "manual";
  selectedCoordinates: [number, number] | null;
  mapState: { center: [number, number]; zoom: number };
  handleMapClick: (e: any) => void;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  selectedEvent,
  handleSubmit,
  formData,
  handleInputChange,
  handleDateChange,
  toggleInputMethod,
  inputMethod,
  selectedCoordinates,
  mapState,
  handleMapClick,
  closeModal,
  modalRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modal1}>
        <h2>{selectedEvent ? "редактировать событие" : "добавить событие"}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="название"
              onChange={handleInputChange}
              required
              className={styles.modalInput}
            />
          </div>

          <div>
            <input
              type="date"
              name="date"
              value={formData.date.toISOString().split("T")[0]}
              onChange={handleDateChange}
              required
              className={styles.modalInput}
            />
          </div>

          <div>
            <div>
              <button
                type="button"
                onClick={toggleInputMethod}
                className={styles.modalButton}
              >
                {inputMethod === "map"
                  ? "ввести координаты"
                  : "выбрать на карте"}
              </button>
            </div>

            {inputMethod === "manual" ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="55.684758, 37.738521"
                required
                className={styles.modalInput}
              />
            ) : (
              <div className={styles.modalMap}>
                <YMaps>
                  <Map
                    state={{
                      center: selectedCoordinates || mapState.center,
                      zoom: 12,
                    }}
                    width="100%"
                    height="300px"
                    onClick={handleMapClick}
                  >
                    {selectedCoordinates && (
                      <Placemark
                        geometry={selectedCoordinates}
                        options={{
                          preset: "islands#redIcon",
                        }}
                      />
                    )}
                  </Map>
                </YMaps>
                <div className={styles.modalCoordinates}>
                  выбранные координаты:{" "}
                  {selectedCoordinates
                    ? `${selectedCoordinates[0]}, ${selectedCoordinates[1]}`
                    : "не выбраны"}
                </div>
              </div>
            )}
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="описание"
              required
              className={styles.modalInput}
            />
          </div>

          <div>
            <button type="submit" className={styles.modalButton}>
              {selectedEvent ? "обновить" : "создать"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={styles.modalCloseButton}
            ></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
