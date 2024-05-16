import { UserType } from "../Types/userType";

export default function UserThumbnail({ user }: { user: UserType }) {
  return (
    <div className="p-4 bg-cyan-700 dark:bg-zinc-700 m-3">
      <p className="text-white text-xl">
        {user.name.toUpperCase()} {user.surname}, {user.userRole}
      </p>
    </div>
  );
}
