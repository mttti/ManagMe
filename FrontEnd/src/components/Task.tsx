import { useEffect, useState } from "react";
import { TaskType } from "../Types/taskType";
import { UserApi } from "../api";
import { UserType } from "../Types/userType";
import { useAuthContext } from "../hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";

export default function Task({
  task,
  projectName,
  editTask,
  deleteTask,
  markAsDone,
  assignUser,
  usersAvailable,
}: {
  task: TaskType;
  projectName: string;
  editTask: (task: TaskType) => void;
  deleteTask: (id: string) => void;
  markAsDone: (task: TaskType) => void;
  assignUser: (task: TaskType, user: UserType) => void;
  usersAvailable: UserType[] | null;
}) {
  const [users, setUsers] = useState<UserType[] | null>(usersAvailable);
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const [userToken, setUserToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const context = useAuthContext();
  let borderPriority: string;

  if (task.priority === "HIGH") {
    borderPriority = "border-red-500";
  } else if (task.priority === "MEDIUM") {
    borderPriority = "border-orange-500";
  } else {
    borderPriority = "border-green-500";
  }

  useEffect(() => {
    setUserToken(context.user.accessToken);
    if (userToken) {
      const decodedToken: { userRole: string; userId: string } =
        jwtDecode(userToken);

      setUserRole(decodedToken.userRole);
      setUserId(decodedToken.userId);
    }
  }, [context]);

  function assignUserHandler() {
    let assignedUser = users?.find((u) => u.GUID === assignedUserId);
    if (assignedUser) {
      assignUser(task, assignedUser);
    }
  }
  return (
    <div
      className={`bg-cyan-700 dark:bg-zinc-700 text-white p-5 mb-5 ${borderPriority} border-2`}
    >
      <p className="text-2xl">Project name: {projectName}</p>
      <p className="text-xl">Name: {task.name}</p>
      <p className="text-xl">Description: {task.description}</p>
      <p className="text-xl">
        Date of addition: {new Date(task.additionDate).toLocaleDateString()}
      </p>
      <p className="text-xl">Expected execution time: {task.expectedTime}</p>
      <p className="text-xl">Task priority: {task.priority}</p>
      <p className="text-xl">
        {task.startDate
          ? `Start date: ${new Date(task.startDate).toDateString()}`
          : "The task has not yet started"}
      </p>
      <p className="text-xl">Completed hours: TODO</p>
      <p className="text-xl">
        {task.UserId ? (
          `Assigned person: ${users?.find((u) => u.GUID === task.UserId)?.name}`
        ) : (
          <>
            <select
              name="user"
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="text-black"
              defaultValue=""
            >
              <option disabled value="">
                Select user
              </option>
              {users ? (
                users
                  ?.filter((u) => u.userRole != "ADMIN")
                  .map((user, index) => (
                    <option value={user.GUID} key={user.GUID}>
                      {user.name}
                    </option>
                  ))
              ) : (
                <option>NO USERS AVAILABLE</option>
              )}
            </select>
            <br />
            <button onClick={assignUserHandler}>Assign a person</button>
          </>
        )}
      </p>

      {task.finishDate && (
        <p className="text-xl">
          Finish date: {new Date(task.finishDate).toDateString()}
        </p>
      )}
      <div className="flex justify-evenly mt-5">
        {(task.status === "DOING" && task.UserId === userId) ||
        userRole === "ADMIN" ||
        userRole === "DEVOPS" ? (
          <button
            className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-500 dark:hover:bg-zinc-500"
            onClick={() => markAsDone(task)}
          >
            Mark as done
          </button>
        ) : (
          ""
        )}
        {userRole !== "DEVELOPER" ? (
          <>
            <button
              className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-500 dark:hover:bg-zinc-500"
              onClick={() => editTask(task)}
            >
              Edit
            </button>
            <button
              className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-500 dark:hover:bg-zinc-500"
              onClick={() => deleteTask(task.GUID)}
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
