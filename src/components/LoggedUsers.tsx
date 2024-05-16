import { useEffect, useState } from "react";
import { UserApi } from "../api";
import UserThumbnail from "./UserThumbnail";
import { UserType } from "../Types/userType";

export default function LoggedUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const userApi = new UserApi();

  useEffect(() => {
    async function getLoggedUser() {
      setUsers(await userApi.getAllUsers());
    }
    getLoggedUser();
  }, []);

  return (
    <div className="bg-cyan-800 dark:bg-zinc-800 w-1/6 h-fit p-5 mt-10 ml-5 mr-5">
      <h1 className="text-2xl mb-10 text-center text-white">Logged users</h1>
      {users.map((user) => (
        <UserThumbnail user={user} key={user.GUID} />
      ))}
    </div>
  );
}
