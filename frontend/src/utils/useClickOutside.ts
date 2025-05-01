import { RefObject, useEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  isActive: boolean,
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, isActive]);
};
