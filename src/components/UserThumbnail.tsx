import { UserType } from "../Types/userType";

export default function UserThumbnail({ user }: { user: UserType }) {
  return (
    <div className="p-4 bg-purple-500 m-3">
      <p>
        {user.name} {user.surname}, {user.userRole}
      </p>
    </div>
  );
}
