import { useUserLogic } from "../../api/userLogic";
import { useModalsLogic } from "../../api/modalsLogic";
import { useHandlesLogic } from "../../api/handlesLogic";

import styles from "./HomePage.module.scss";

import kotImage from "../../img/kot.jpg";

import Header from "../../components/header/Header";
import LoginModal from "../../components/modals/LoginModal";
import BurgerModal from "../../components/modals/BurgerModal";

const HomePage = () => {
  const { userData, message, isLoading } = useUserLogic();

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

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <Header
        userData={userData}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsBurgerModalOpen={setIsBurgerModalOpen}
        handleHome={handleHome}
      />

      <div className={styles.content}>
        <div className={styles.contentText}>
          <h1>события!!</h1>
          <p>
            тут можно найти себе мероприятие на день или создать своё. нужно
            только зарегистрироваться
          </p>
          <button onClick={handleEvents} className={styles.contentEventButton}>
            события
          </button>
        </div>

        <div className={styles.contentDivImage}>
          <img src={kotImage} alt="котик" className={styles.contentImage} />
        </div>
      </div>

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

export default HomePage;
