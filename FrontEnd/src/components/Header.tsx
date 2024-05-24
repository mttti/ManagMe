import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import darkImg from "../assets/img/dark-mode.png";
import lightImg from "../assets/img/light-mode.png";
import { useLogout } from "../hooks/useLogout";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../hooks/useAuthContext";
import socketIO from "socket.io-client";
import { notificationType } from "../Types/notificationType";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>();
  const { logout } = useLogout();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [notifications, setNotifications] = useState<notificationType[]>([]);
  const context = useAuthContext();
  let socket: any = socketIO("http://localhost:4001");

  useEffect(() => {
    const token = context.user ? context.user.accessToken : null;
    if (token) {
      const decodedToken: { userName: string; userId: string } =
        jwtDecode(token);
      setUserId(decodedToken.userId);
      setUserName(decodedToken.userName!);
      if (userId) {
        socket.emit("getNotifications", { userId: userId });
        socket.on("userNotifications", (notifications: any) => {
          setNotifications(notifications);
        });
      }
    }
    const dark = JSON.parse(localStorage.getItem("dark")!) ?? false;
    if (dark) {
      setIsDarkMode(dark);
      document.documentElement.classList.add("dark");
    }
    if (!dark) {
      setIsDarkMode(dark);
      document.documentElement.classList.remove("dark");
    }
  }, [context, userName]);

  function logoutHandler() {
    const data = localStorage.getItem("user");
    if (data) {
      setUserName("");
      setUserId("");
      setNotifications([]);
      socket.disconnect();
      logout();
    }
  }

  function toggleThemeMode() {
    setIsDarkMode((prevState) => !prevState);
    if (!isDarkMode) {
      //dark mode
      localStorage.setItem("dark", "true");
      document.documentElement.classList.add("dark");
    } else {
      //light mode
      localStorage.setItem("dark", "false");
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <>
      <header className="border-b-2 border-white flex w-full h-fit px-5 justify-between items-center content-center bg-cyan-800 dark:bg-zinc-800 ">
        <div>
          <h1 className="text-white font-bold text-4xl">ManagMe</h1>
        </div>
        <div className="flex h-fit text-white justify-evenly">
          {userName && (
            <div className="mx-3 p-3 flex">
              <Link to="/notifications" state={notifications}>
                Notifications:{" "}
                {notifications!.filter((n) => n.read !== 1).length}
              </Link>
            </div>
          )}

          <p
            className="mx-3 p-3 "
            onClick={() => socket.emit("addNotification", { dd: "d" })}
          >
            {userName ? (
              `HELLO, ${userName.toUpperCase()}`
            ) : (
              <Link to="/sign-in">Login</Link>
            )}
          </p>
          <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
            <Link to="/">Projects</Link>
          </p>
          <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
            <Link to="/pinned-project">Pinned project</Link>
          </p>
          {userName && (
            <p className="mx-3 p-3 hover:bg-cyan-700 dark:hover:bg-zinc-700">
              <button onClick={logoutHandler}>Logout</button>
            </p>
          )}
          <p className="mx-3 p-3 cursor-pointer" onClick={toggleThemeMode}>
            <img src={isDarkMode ? lightImg : darkImg} className="w-7 h-7" />
          </p>
        </div>
      </header>
    </>
  );
}
