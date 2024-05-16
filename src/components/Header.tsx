import { Link } from "react-router-dom";
import { UserApi } from "../api";
import { useEffect, useState } from "react";
import darkImg from "../assets/img/dark-mode.png";
import lightImg from "../assets/img/light-mode.png";

export default function Header({ userName }: { userName: string }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const userApi = new UserApi();
  function logout() {
    const data = localStorage.getItem("loggedUser");
    if (data) {
      const userInfo = JSON.parse(data!);
      userApi.logout(userInfo.accessToken, userInfo.refreshToken);
      localStorage.removeItem("loggedUser");
    }
  }
  // document.querySelector("body")?.classList.add("bg-cyan-50");

  function toggleThemeMode() {
    setIsDarkMode((prevState) => !prevState);
    if (isDarkMode) {
      //dark mode
      document.documentElement.classList.add("dark");
      document.querySelector("body")?.classList.add("bg-zinc-600");
      document.querySelector("body")?.classList.remove("bg-cyan-50");
    } else {
      //light mode
      document.querySelector("body")?.classList.add("bg-cyan-50");
      document.querySelector("body")?.classList.remove("bg-zinc-600");
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <>
      <header className="border-b-2 border-white flex w-full h-fit px-5 justify-between items-center content-center bg-cyan-800 dark:bg-zinc-800 ">
        <div>
          <h1 className="text-white font-bold text-4xl">ManageMe</h1>
        </div>
        <div className="flex h-fit text-white justify-evenly">
          <p className="mx-3 p-3 ">
            {userName ? (
              `HELLO, ${userName.toUpperCase()}`
            ) : (
              <Link to="/sign-in">Sign in</Link>
            )}
          </p>
          <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
            <Link to="/all-projects">All projects</Link>
          </p>
          <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
            <Link to="/pinned-project">Pinned project</Link>
          </p>
          {userName && (
            <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
              <button onClick={logout}>Logout</button>
            </p>
          )}
          <p className="mx-3 p-3 cursor-pointer" onClick={toggleThemeMode}>
            <img src={!isDarkMode ? lightImg : darkImg} className="w-7 h-7" />
          </p>
        </div>
      </header>
    </>
  );
}
