import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { UserApi } from "../api";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const api = new UserApi();

  const loginUser = async (login: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const response = await api.login(login, password);

    const json = await response;

    if (!response.success) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.success) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
    }
  };
  return { loginUser, isLoading, error };
};
