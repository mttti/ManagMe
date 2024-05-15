import { useState } from "react";
import { UserApi } from "../api";
import { json, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default function SignIn({}: {}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const api = new UserApi();
  let navigate = useNavigate();

  function loginHandler() {
    if (login != "" && password != "") {
      api.login(login, password).then((res) => {
        if (res.success) {
          navigate("/all-projects");
          console.log(res);
          //console.log(JSON.parse(localStorage.getItem("loggedUser")!));
          localStorage.setItem("loggedUser", JSON.stringify(res));
        } else {
          alert(res.message);
        }
      });
    }
    // api.login(login, password).then((token) => console.log(token));
    // console.log(login, password);
  }

  return (
    <div className="bg-purple-400 flex flex-col p-10 items-center m-1">
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
        className="mt-5 bg-purple-300 p-2 rounded-md"
        onClick={loginHandler}
      >
        Login
      </button>

      <GoogleLogin
        onSuccess={(res) => {
          let credential = jwtDecode(res.credential!);
          navigate("/all-projects");
          api
            .googleLogin(credential.id, credential.email, credential.name)
            .then((res) => {
              console.log(res);
              const data = {
                userName: credential.name,
                login: res.login,
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
              };
              localStorage.setItem("loggedUser", JSON.stringify(data));
            });
        }}
        onError={() => {
          console.log("Login failed");
        }}
      ></GoogleLogin>
    </div>
  );
}
