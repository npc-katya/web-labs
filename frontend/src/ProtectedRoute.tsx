import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
