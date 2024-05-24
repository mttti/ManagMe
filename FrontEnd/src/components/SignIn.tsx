import { useState } from "react";
import { UserApi } from "../api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";
export default function SignIn({}: {}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const api = new UserApi();
  const { dispatch } = useAuthContext();
  const { loginUser, error, isLoading } = useLogin();
  let navigate = useNavigate();

  async function loginHandler() {
    if (login != "" && password != "") {
      await loginUser(login, password);
      navigate("/");
    }
  }

  return (
    <div className="flex justify-center p-5">
      <div className="bg-cyan-800 dark:bg-zinc-800 flex flex-col p-10 items-center m-1 w-1/2">
        <input
          type="text"
          name="login"
          id="login"
          placeholder="Login"
          className="w-fit p-4 mb-10"
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="w-fit p-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="text-white bg-cyan-700 dark:bg-zinc-700 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-cyan-600 dark:hover:bg-zinc-600 my-5"
          onClick={loginHandler}
          disabled={isLoading}
        >
          Login
        </button>
        {error && <div>{error}</div>}

        <GoogleLogin
          onSuccess={(res) => {
            let credential: { id: string; email: string; name: string } =
              jwtDecode(res.credential!);
            navigate("/");
            api
              .googleLogin(credential.id, credential.email, credential.name)
              .then((res) => {
                const data = {
                  userName: credential.name,
                  login: res.login,
                  accessToken: res.accessToken,
                  refreshToken: res.refreshToken,
                };
                localStorage.setItem("user", JSON.stringify(data));
                dispatch({ type: "LOGIN", payload: data });
              });
          }}
          onError={() => {
            console.log("Login failed");
          }}
        ></GoogleLogin>
      </div>
    </div>
  );
}
