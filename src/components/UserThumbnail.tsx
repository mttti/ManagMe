import { User } from "../User";

export default function UserThumbnail({ user }: { user: User }) {
  return (
    <div className="p-4 bg-purple-500 m-3">
      <p>
        {user.userData.name} {user.userData.surname}, {user.userData.userRole}
      </p>
    </div>
  );
}
