import { Link } from "react-router-dom";
import { UserApi } from "../api";
import { useEffect } from "react";

export default function Header({ userName }: { userName: string }) {
  const userApi = new UserApi();
  function logout() {
    const data = localStorage.getItem("loggedUser");
    if (data) {
      const userInfo = JSON.parse(data!);
      userApi.logout(userInfo.accessToken, userInfo.refreshToken);
      localStorage.removeItem("loggedUser");
    }
  }

  useEffect(() => {}, []);

  return (
    <>
      <header className="border-b-2 border-white flex w-full h-40 justify-around items-center bg-purple-700 content-center">
        <div className="flex text-3xl  h-fit">
          <p>
            {userName ? (
              `Hello, ${userName}`
            ) : (
              <Link to="/sign-in">Sign in</Link>
            )}
          </p>
        </div>

        <div>
          <h1 className="text-white font-bold text-5xl">ManageMe</h1>
        </div>
        <div>
          <p>
            <Link to="/all-projects">All projects</Link>
          </p>
          <p>
            <Link to="/pinned-project">Pinned project</Link>
          </p>
          <p>{userName && <button onClick={logout}>Logout</button>}</p>
        </div>
      </header>
    </>
  );
}
