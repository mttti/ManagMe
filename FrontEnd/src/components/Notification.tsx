import { notificationType } from "../Types/notificationType";

export default function Notification({
  notification,
  markAdRead,
}: {
  notification: notificationType;
  markAdRead: (GUID: string) => void;
}) {
  let borderPriority: string;
  if (notification.priority === "HIGH") {
    borderPriority = "border-red-500";
  } else if (notification.priority === "MEDIUM") {
    borderPriority = "border-orange-500";
  } else {
    borderPriority = "border-green-500";
  }
  return (
    <div
      className={`w-full bg-cyan-800 dark:bg-zinc-800  border-4 ${borderPriority} p-10 text-white mb-5 ${notification.read == 1 ? "opacity-60" : "opacity-100"} hover:opacity-100`}
    >
      <p className="text-2xl mb-3">Title: {notification.title}</p>
      <p className="text-2xl mb-3">
        Date: {new Date(notification.date).toDateString()}
      </p>
      <p className="text-2xl mb-3">Priority: {notification.priority}</p>
      {notification.read == 0 && (
        <button
          onClick={() => {
            markAdRead(notification.GUID);
            notification.read = 1;
          }}
          className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-500 dark:hover:bg-zinc-500"
        >
          Mark as read
        </button>
      )}
    </div>
  );
}
