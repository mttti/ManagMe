import { useEffect, useState } from "react";
import { TaskType } from "../Types/taskType";
import { User } from "../User";
import { UserApi } from "../api";

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
  assignUser: (task: TaskType, user: User) => void;
}) {
  const [users, setUsers] = useState<User[]>();
  const [assignedUserId, setAssignedUserId] = useState<string>("");

  useEffect(() => {
    try {
      setUsers(UserApi.getAllUsers());
    } catch (error) {}
  }, [task]);

  function assignUserHandler() {
    let assignedUser = users?.find((u) => u.userData.id === assignedUserId);
    if (assignedUser) {
      assignUser(task, assignedUser);
    }
  }
  return (
    <div className="bg-purple-400 p-5 mb-5">
      <p>Project name: {projectName}</p>
      <p>Story id: {task.storyId}</p>
      <p>Name: {task.name}</p>
      <p>Description: {task.description}</p>
      <p>Date of addition: {new Date(task.additonDate).toLocaleDateString()}</p>
      <p>Expected execution time: {task.expectedTime}</p>
      <p>Task priority: {task.priority}</p>
      <p>
        {task.startDate
          ? `Start date: ${task.startDate}`
          : "The task has not yet started"}
      </p>
      <p>Completed hours: TODO</p>
      <p>
        {task.User ? (
          `Assigned person: ${task.User.userData.name}`
        ) : (
          <>
            <select
              name="user"
              onChange={(e) => setAssignedUserId(e.target.value)}
            >
              <option disabled key="selectUserOption" selected>
                Select user
              </option>
              {users
                ?.filter((u) => u.userData.userRole != "ADMIN")
                .map((user, index) => (
                  <option value={user.userData.id} key={user.userData.id}>
                    {user.userData.name}
                  </option>
                ))}
            </select>
            <br />
            <button onClick={assignUserHandler}>Assign a person</button>
          </>
        )}
      </p>
      {task.startDate && (
        <p>Start date: {new Date(task.startDate).toLocaleDateString()}</p>
      )}
      {task.finishDate && (
        <p>Finish date: {new Date(task.finishDate).toLocaleDateString()}</p>
      )}
      {task.status === "DOING" && (
        <button onClick={() => markAsDone(task)}>Mark as done</button>
      )}
      <div className="flex justify-evenly">
        <button onClick={() => editTask(task)}>Edit</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
}
