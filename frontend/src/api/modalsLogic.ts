import { useState, useRef } from "react";
import { useClickOutside } from "../utils/useClickOutside";

export const useModalsLogic = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBurgerModalOpen, setIsBurgerModalOpen] = useState(false);

  const loginModalRef = useRef<HTMLDivElement>(null);
  const burgerModalRef = useRef<HTMLDivElement>(null);

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
