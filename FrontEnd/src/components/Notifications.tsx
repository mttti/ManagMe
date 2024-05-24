import { useLocation } from "react-router-dom";
import Notification from "./Notification";
import { notificationType } from "../Types/notificationType";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";
import { NotificationApi } from "../api";

export default function Notifications() {
  const { state } = useLocation();
  const notifications = state;
  const [userToken, setUserToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const context = useAuthContext();
  const api = new NotificationApi();
  useEffect(() => {
    setUserToken(context.user.accessToken);
    if (userToken) {
      const decodedToken: { userRole: string } = jwtDecode(userToken);
      setUserRole(decodedToken.userRole);
    }
  }, [userRole, userToken]);

  function markAsRead(GUID: string) {
    api.markAsRead(userToken, GUID);
  }

  return (
    <div className="flex flex-col items-center my-5 px-5 ">
      {notifications.length > 0 ? (
        notifications.map((notification: notificationType) => (
          <Notification
            key={notification.GUID}
            notification={notification}
            markAdRead={markAsRead}
          />
        ))
      ) : (
        <div className="text-black dark:text-white mt-10 text-3xl">
          There are no notifications yet...
        </div>
      )}
    </div>
  );
}
