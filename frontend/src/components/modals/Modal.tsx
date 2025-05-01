import React, { RefObject, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import styles from "./Modals.module.scss";
import { EventType } from "../../types/EventType";

interface FormData {
  title: string;
  date: string;
  location: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  selectedEvent: EventType | null;
  handleSubmit: (data: Omit<FormData, "date"> & { date: Date }) => void;
  inputMethod: "map" | "manual";
  toggleInputMethod: () => void;
  selectedCoordinates: [number, number] | null;
  mapState: { center: [number, number]; zoom: number };
  handleMapClick: (e: any) => void;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
}

const Modal: React.FC<ModalProps> = memo(
  ({
    isOpen,
    selectedEvent,
    handleSubmit,
    inputMethod,
    toggleInputMethod,
    selectedCoordinates,
    mapState,
    handleMapClick,
    closeModal,
    modalRef,
  }) => {
    const {
      register,
      handleSubmit: handleFormSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FormData>({
      defaultValues: {
        title: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        description: "",
      },
    });

    useEffect(() => {
      if (selectedEvent) {
        reset({
          title: selectedEvent.title ?? "",
          date: new Date(selectedEvent.date).toISOString().split("T")[0],
          location: selectedEvent.location ?? "",
          description: selectedEvent.description ?? "",
        });
      } else {
        reset({
          title: "",
          date: new Date().toISOString().split("T")[0],
          location: "",
          description: "",
        });
      }
    }, [selectedEvent, reset]);

    useEffect(() => {
      if (selectedCoordinates) {
        const formattedCoords = `${selectedCoordinates[0]}, ${selectedCoordinates[1]}`;
        setValue("location", formattedCoords);
      }
    }, [selectedCoordinates, setValue]);

    if (!isOpen) return null;

    const onSubmit = (data: FormData) => {
      handleSubmit({
        ...data,
        date: new Date(data.date),
      });
    };

    return (
      <div className={styles.modalOverlay}>
        <div ref={modalRef} className={styles.modal1}>
          <h2>
            {selectedEvent ? "редактировать событие" : "добавить событие"}
          </h2>

          <form onSubmit={handleFormSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                placeholder="название"
                {...register("title", {
                  required: "название обязательно",
                  maxLength: {
                    value: 100,
                    message: "название не должно превышать 100 символов",
                  },
                })}
                className={styles.modalInput}
              />
              {errors.title && (
                <div className={styles.error}>{errors.title.message}</div>
              )}
            </div>

            <div>
              <input
                type="date"
                {...register("date", {
                  required: "дата обязательна",
                  validate: (value) => {
                    const selected = new Date(value);
                    const now = new Date();
                    selected.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    if (selected < now) return "дата не может быть в прошлом";
                    return true;
                  },
                })}
                min={new Date().toISOString().split("T")[0]}
                className={styles.modalInput}
              />
              {errors.date && (
                <div className={styles.error}>{errors.date.message}</div>
              )}
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
                <div>
                  <input
                    type="text"
                    placeholder="55.684758, 37.738521"
                    {...register("location", {
                      required: "местоположение обязательно",
                      pattern: {
                        value: /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/,
                        message:
                          'неверный формат координат. Используйте: "широта, долгота"',
                      },
                    })}
                    className={styles.modalInput}
                  />
                  {errors.location && (
                    <div className={styles.error}>
                      {errors.location.message}
                    </div>
                  )}
                </div>
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
                placeholder="описание"
                {...register("description", {
                  required: "описание обязательно",
                  maxLength: {
                    value: 500,
                    message: "описание не должно превышать 500 символов",
                  },
                })}
                className={styles.modalInput}
              />
              {errors.description && (
                <div className={styles.error}>{errors.description.message}</div>
              )}
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
  },
);

export default Modal;
