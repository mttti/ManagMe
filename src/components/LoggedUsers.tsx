import { User } from "../User";
import { UserApi } from "../api";
import UserThumbnail from "./UserThumbnail";

export default function LoggedUsers() {
  const users: User[] = UserApi.getAllUsers();
  return (
    <div className="bg-purple-400 w-1/6 h-fit p-5 mt-1 ml-5 mr-5">
      <h1 className="text-2xl mb-10 text-center">Logged users</h1>
      {users.map((user) => (
        <UserThumbnail user={user} key={user.userData.id} />
      ))}
    </div>
  );
}
