import { useEventLogic } from "../../api/eventLogic";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import styles from "./EventsPage.module.scss";

import Header from "../../components/header/Header";
import LoginModal from "../../components/modals/LoginModal";
import BurgerModal from "../../components/modals/BurgerModal";
import Modal from "../../components/modals/Modal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import ActionsModal from "../../components/modals/ActionsModal";

import { useUserLogic } from "../../api/userLogic";
import { useModalsLogic } from "../../api/modalsLogic";
import { useHandlesLogic } from "../../api/handlesLogic";

import menu from "../../img/menu.svg";

const EventForm = () => {
  const { userData } = useUserLogic();

  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isBurgerModalOpen,
    setIsBurgerModalOpen,
    loginModalRef,
    burgerModalRef,
  } = useModalsLogic();

  const {
    handleLogin,
    handleRegister,
    handleEvents,
    handleLogout,
    handleHome,
  } = useHandlesLogic();

  const {
    modalRef,
    actionModalRef,
    deleteConfirmRef,
    formData,
    inputMethod,
    selectedCoordinates,
    closeModal,
    currentUser,
    selectedEvent,
    closeDeleteConfirm,
    closeActionsModal,

    message,
    isLoading,
    isModalOpen,
    isActionsModalOpen,
    isDeleteConfirmOpen,
    mapState,
    highlightedEvent,
    handleMapClick,
    filteredEvents,
    handleSubmit,
    handleDelete,
    openActionsModal,
    openDeleteConfirm,
    openEditModal,
    openCreateModal,
    handleInputChange,
    handleDateChange,
    toggleInputMethod,
    showEventOnMap,
  } = useEventLogic();

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      {/* шапка */}
      <Header
        userData={userData}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsBurgerModalOpen={setIsBurgerModalOpen}
        handleHome={handleHome}
      />

      {/* основа */}
      <div className={styles.content}>
        {/* карта */}
        <div className={styles.mapContainer}>
          {/* карта событий */}
          <div>
            <YMaps>
              <Map state={mapState} className={styles.map}>
                {filteredEvents.map((event) => (
                  <Placemark
                    key={event.id}
                    geometry={event.coordinates}
                    properties={{
                      balloonContentHeader: event.title,
                      balloonContentBody: `
                    <p><strong>дата:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>создатель:</strong> ${event.creatorName}</p>
                    <p>${event.description}</p>
                  `,
                      hintContent: event.title,
                    }}
                    options={{
                      preset:
                        event.id === highlightedEvent
                          ? "islands#redDotIcon"
                          : "islands#blueEventCircleIcon",
                      iconColor:
                        event.createdBy === currentUser.id
                          ? "#8e85c9"
                          : "#bcaeaf",
                      hideIconOnBalloonOpen: false,
                    }}
                    modules={[
                      "geoObject.addon.balloon",
                      "geoObject.addon.hint",
                    ]}
                  />
                ))}
              </Map>
            </YMaps>
          </div>
        </div>

        {/* основа событий */}
        <div className={styles.eventsContainer}>
          {/* шапка событий */}
          <div className={styles.eventsHeader}>
            <h1>события:</h1>
            <div>
              {currentUser.id && (
                <button
                  onClick={openCreateModal}
                  className={styles.openCreateModalButton}
                >
                  добавить событие
                </button>
              )}
            </div>
          </div>

          {/* события */}
          <div className={styles.events}>
            {filteredEvents.length === 0 ? (
              <p>события не найдены</p>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className={styles.event}>
                  {" "}
                  <div className={styles.eventText}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventMeta}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className={styles.eventDescription}>
                      <strong>описание:</strong> {event.description}
                    </p>
                    <p className={styles.creatorName}>@{event.creatorName}</p>
                    <p className={styles.eventMeta}>{event.location}</p>
                  </div>
                  <button
                    onClick={() => openActionsModal(event)}
                    className={styles.menuButton}
                  >
                    <img src={menu} alt="меню" className={styles.menuImage} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* модальное окно для создания, изменения */}
      <Modal
        isOpen={isModalOpen}
        selectedEvent={selectedEvent}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleDateChange={handleDateChange}
        toggleInputMethod={toggleInputMethod}
        inputMethod={inputMethod}
        selectedCoordinates={selectedCoordinates}
        mapState={mapState}
        handleMapClick={handleMapClick}
        closeModal={closeModal}
        modalRef={modalRef}
      />

      {isActionsModalOpen && selectedEvent && (
        <ActionsModal
          ref={actionModalRef}
          selectedEvent={selectedEvent}
          currentUser={currentUser}
          showEventOnMap={showEventOnMap}
          openEditModal={openEditModal}
          openDeleteConfirm={openDeleteConfirm}
          closeActionsModal={closeActionsModal}
        />
      )}

      {/* модальное окно для подтвеждения удаления */}
      {isDeleteConfirmOpen && (
        <DeleteConfirmModal
          ref={deleteConfirmRef}
          handleDelete={handleDelete}
          closeDeleteConfirm={closeDeleteConfirm}
          closeActionsModal={closeActionsModal}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userData={userData}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
        modalRef={loginModalRef}
      />

      <BurgerModal
        isOpen={isBurgerModalOpen}
        onClose={() => setIsBurgerModalOpen(false)}
        handleHome={handleHome}
        handleEvents={handleEvents}
        modalRef={burgerModalRef}
      />

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default EventForm;
