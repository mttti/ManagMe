import { useEffect, useState } from "react";
import { TaskType } from "../Types/taskType";
import { UserApi } from "../api";
import { UserType } from "../Types/userType";

export default function Task({
  task,
  projectName,
  editTask,
  deleteTask,
  markAsDone,
  assignUser,
}: {
  task: TaskType;
  projectName: string;
  editTask: (task: TaskType) => void;
  deleteTask: (id: string) => void;
  markAsDone: (task: TaskType) => void;
  assignUser: (task: TaskType, user: UserType) => void;
}) {
  const [users, setUsers] = useState<UserType[]>();
  const [assignedUserId, setAssignedUserId] = useState<string>("");
  const userApi = new UserApi();
  useEffect(() => {
    async function get() {
      try {
        setUsers(await userApi.getAllUsers());
      } catch (error) {}
    }
    get();
  }, [task]);

  function assignUserHandler() {
    let assignedUser = users?.find((u) => u.GUID === assignedUserId);
    if (assignedUser) {
      assignUser(task, assignedUser);
    }
  }
  return (
    <div className="bg-cyan-700 dark:bg-zinc-700 text-white p-5 mb-5">
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
            >
              <option disabled key="selectUserOption" selected>
                Select user
              </option>
              {users
                ?.filter((u) => u.userRole != "ADMIN")
                .map((user, index) => (
                  <option value={user.GUID} key={user.GUID}>
                    {user.name}
                  </option>
                ))}
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
        {task.status === "DOING" && (
          <button
            className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 px-5 py-1 rounded-md hover:bg-cyan-500 dark:hover:bg-zinc-500"
            onClick={() => markAsDone(task)}
          >
            Mark as done
          </button>
        )}
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
      </div>
    </div>
  );
}
