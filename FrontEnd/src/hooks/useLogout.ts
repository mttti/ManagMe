import { UserApi } from "../api";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const userApi = new UserApi();

  const logout = () => {
    const { accessToken, refreshToken } = JSON.parse(
      localStorage.getItem("user")!
    );
    userApi.logout(accessToken, refreshToken);

    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
