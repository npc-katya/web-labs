import { useState, useRef } from "react";
import { useClickOutside } from "../utils/useClickOutside";

export const useModalsLogic = () => {
  // состояния для модальных окон
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBurgerModalOpen, setIsBurgerModalOpen] = useState(false);

  // рефы для модальных окон
  const loginModalRef = useRef<HTMLDivElement>(null);
  const burgerModalRef = useRef<HTMLDivElement>(null);

  // обработчики кликов вне модальных окон
  useClickOutside(
    loginModalRef,
    () => setIsLoginModalOpen(false),
    isLoginModalOpen,
  );
  useClickOutside(
    burgerModalRef,
    () => setIsBurgerModalOpen(false),
    isBurgerModalOpen,
  );

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isBurgerModalOpen,
    setIsBurgerModalOpen,
    loginModalRef,
    burgerModalRef,
  };
};
