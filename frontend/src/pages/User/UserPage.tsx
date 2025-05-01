import { useUserLogic } from "../../api/userLogic";
import styles from "./UserPage.module.scss";
import { useEventLogic } from "../../api/eventLogic";
import menu from "../../img/menu.svg";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import Header from "../../components/header/Header";
import LoginModal from "../../components/modals/LoginModal";
import BurgerModal from "../../components/modals/BurgerModal";
import Modal from "../../components/modals/Modal";
import ActionsModal from "../../components/modals/ActionsModal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import { useModalsLogic } from "../../api/modalsLogic";
import { useHandlesLogic } from "../../api/handlesLogic";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
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
    handleMapClick,
    filteredEvents,
    handleSubmit,
    handleDelete,
    openActionsModal,
    openDeleteConfirm,
    openEditModal,
    toggleInputMethod,
    showEventOnMap,
  } = useEventLogic();

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") return value;
    }
    return null;
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const userEvents = filteredEvents.filter(
    (event) => event.createdBy === userData.id,
  );

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  return (
    <div>
      {/* шапка */}
      <Header
        userData={userData}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsBurgerModalOpen={setIsBurgerModalOpen}
        handleHome={handleHome}
      />

      {/* наполнение страницы */}
      <div className={styles.content}>
        <div className={styles.userMapContainer}>
          {/* данные пользователя */}
          <div className={styles.userContainer}>
            <div className={styles.userData}>
              <h2>профиль:</h2>
              <h3>имя: {userData.name}</h3>
              <h3>почта: {userData.email}</h3>
            </div>
          </div>

          {/* карта */}
          <div className={styles.mapContainer}>
            <div>
              <YMaps>
                <Map state={mapState} className={styles.map}>
                  {userEvents.map((event) => (
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
                        preset: "islands#blueEventCircleIcon",
                        iconColor: "#8e85c9",
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
        </div>

        {/* события */}
        <h2>мои мероприятия:</h2>
        <div className={styles.events}>
          {userEvents.length === 0 ? (
            <p>У вас пока нет событий</p>
          ) : (
            userEvents.map((event) => (
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

        {/* модальное окно для создания, изменения */}
        <Modal
          isOpen={isModalOpen}
          selectedEvent={selectedEvent}
          handleSubmit={handleSubmit}
          toggleInputMethod={toggleInputMethod}
          inputMethod={inputMethod}
          selectedCoordinates={selectedCoordinates}
          mapState={mapState}
          handleMapClick={handleMapClick}
          closeModal={closeModal}
          modalRef={modalRef}
        />

        {/* модальное окно для действий */}
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

        {/* модальное окно для входа выхода */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          userData={userData}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleLogout={handleLogout}
          modalRef={loginModalRef}
        />

        {/* модальное окно для меню */}
        <BurgerModal
          isOpen={isBurgerModalOpen}
          onClose={() => setIsBurgerModalOpen(false)}
          handleHome={handleHome}
          handleEvents={handleEvents}
          modalRef={burgerModalRef}
        />
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default UserPage;
