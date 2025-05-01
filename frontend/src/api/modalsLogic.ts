import { useState, useRef } from "react";
import { useClickOutside } from "../utils/useClickOutside";

export const useModalsLogic = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBurgerModalOpen, setIsBurgerModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const loginModalRef = useRef<HTMLDivElement>(null);
  const burgerModalRef = useRef<HTMLDivElement>(null);
  const userModalRef = useRef<HTMLDivElement>(null);

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
  useClickOutside(
    userModalRef,
    () => setIsUserModalOpen(false),
    isUserModalOpen,
  );

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isBurgerModalOpen,
    setIsBurgerModalOpen,
    isUserModalOpen,
    setIsUserModalOpen,
    loginModalRef,
    burgerModalRef,
    userModalRef,
  };
};
