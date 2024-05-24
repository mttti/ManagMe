import { useParams } from "react-router-dom";
import { ProjectApi, TaskApi, UserApi } from "../api";
import Task from "./Task";
import { useEffect, useState } from "react";
import { TaskType } from "../Types/taskType";
import TaskModal from "./Modals/TaskModal";
import { UserType } from "../Types/userType";
import { ProjectType } from "../Types/projectType";
import { useAuthContext } from "../hooks/useAuthContext";
import socketIO from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { notificationType } from "../Types/notificationType";

export default function Tasks() {
  const userApi = new UserApi();
  const context = useAuthContext();
  let taskApi = new TaskApi();
  let projectApi = new ProjectApi();
  let { storyId } = useParams();
  const [hasTasks, setHasTasks] = useState(true);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedTask, setEditedTask] = useState<TaskType>();
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState<ProjectType>();
  const [userToken, setUserToken] = useState(context.user.accessToken);
  const [userRole, setUserRole] = useState("");
  const [users, setUsers] = useState<UserType[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [assignPerson, setAssignPerson] = useState(false);
  let socket: any = socketIO("http://localhost:4001");

  useEffect(() => {
    setIsFetching(true);
    setUserToken(context.user.accessToken);
    if (userToken) {
      const decodedToken: { userRole: string } = jwtDecode(userToken);
      setUserRole(decodedToken.userRole);
      setIsFetching(false);
    }
  }, [context]);

  useEffect(() => {
    async function get() {
      try {
        if (!isFetching) {
          setUsers(await userApi.getAllUsers(userToken));
          //setIsFetching(false);
        }
      } catch (error) {}
    }
    get();
  }, [userToken, isFetching]);

  useEffect(() => {
    async function get() {
      try {
        if (!isFetching) {
          const pinnedProject = await projectApi.getPinnedProject(
            context.user.accessToken
          );
          setProject(pinnedProject);
          setProjectName(pinnedProject.name);
          setAllTasks(await taskApi.getTasksByStoryId(storyId!, userToken));
          setHasTasks(true);
        }
      } catch (error) {
        setHasTasks(false);
      }
    }
    get();
  }, [
    storyId,
    isModalHidden,
    userToken,
    context,
    hasTasks,
    isFetching,
    assignPerson,
  ]);

  function addNewTask(task: TaskType) {
    setIsModalHidden(false);
    try {
      taskApi.addTask(task, userToken);

      setAllTasks((prevState) => [task, ...prevState]);
      toggleModal();
    } catch (error) {}
  }

  function editTask(task: TaskType) {
    try {
      taskApi.updateTask(task, userToken);
      toggleModal();
    } catch (error) {}
  }

  function editTaskToggle(task: TaskType) {
    setEditedTask(task);
    setIsModalHidden(false);
  }

  function assignUser(task: TaskType, user: UserType) {
    setAssignPerson((prevState) => !prevState);
    const updatedTask = { ...task };
    updatedTask.status = "DOING";
    updatedTask.startDate = new Date();

    updatedTask.UserId = user.GUID;
    try {
      taskApi.updateTask(updatedTask, userToken);
      taskApi.assignTaskToUser(
        updatedTask.GUID,
        project?.GUID!,
        updatedTask.UserId,
        context.user.accessToken
      );
      let taskIndex = allTasks.findIndex((t) => t.GUID === task.GUID);
      let tasks = [...allTasks];
      tasks[taskIndex] = task;
      setAllTasks(tasks);

      const notificationData: notificationType = {
        GUID: crypto.randomUUID(),
        title: `You have been assigned to a new task in ${projectName} project!`,
        date: new Date(),
        priority: task.priority,
        read: 0,
        userId: user.GUID,
      };

      socket.emit("addNotification", notificationData);
      socket.disconnect();
    } catch (error) {
      console.log(error);
    }
  }

  function deleteTask(id: string) {
    try {
      taskApi.deleteTask(id, userToken);
      setAllTasks((prevState) => prevState.filter((s) => s.GUID != id));
    } catch (error) {}
  }

  function markAsDone(task: TaskType) {
    task.status = "DONE";
    task.finishDate = new Date();
    try {
      taskApi.updateTask(task, userToken);
      let taskIndex = allTasks.findIndex((t) => t.GUID === task.GUID);
      let tasks = [...allTasks];
      tasks[taskIndex] = task;
      setAllTasks(tasks);
    } catch (error) {}
  }

  function toggleModal() {
    setIsModalHidden((prevState) => !prevState);
    // setEditedStory(undefined);
  }

  return (
    <>
      {!isModalHidden && (
        <TaskModal
          isHidden={isModalHidden}
          toggleFunction={toggleModal}
          storyId={storyId!}
          addTask={addNewTask}
          editTask={editTask}
          task={editedTask}
        ></TaskModal>
      )}
      <div className="flex justify-center flex-col items-center">
        <div className="flex justify-center">
          {userRole !== "DEVELOPER" ? (
            <>
              <button
                className=" text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 my-5 rounded-xl flex cursor-pointer hover:bg-cyan-700 dark:hover:bg-zinc-700"
                onClick={toggleModal}
              >
                Add a new task
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        {hasTasks ? (
          <div className="flex justify-evenly mt-10 w-full">
            <div className="w-1/4 bg-cyan-800 dark:bg-zinc-800   p-5">
              <h1 className="text-center text-3xl p-4 text-white">TODO</h1>
              {allTasks
                .filter((t) => t.status === "TODO")
                .map((task) => (
                  <Task
                    task={task}
                    key={task.GUID}
                    projectName={projectName}
                    deleteTask={deleteTask}
                    editTask={editTaskToggle}
                    markAsDone={markAsDone}
                    assignUser={assignUser}
                    usersAvailable={users}
                  ></Task>
                ))}
            </div>
            <div className="w-1/4 bg-cyan-800 dark:bg-zinc-800   p-5">
              <h1 className="text-center text-3xl p-4 text-white">DOING</h1>
              {allTasks
                .filter((t) => t.status === "DOING")
                .map((task) => (
                  <Task
                    task={task}
                    key={task.GUID}
                    projectName={projectName}
                    deleteTask={deleteTask}
                    editTask={editTaskToggle}
                    markAsDone={markAsDone}
                    assignUser={assignUser}
                    usersAvailable={users}
                  ></Task>
                ))}
            </div>
            <div className="w-1/4 bg-cyan-800 dark:bg-zinc-800   p-5">
              <h1 className="text-center text-3xl p-4 text-white">DONE</h1>
              {allTasks
                .filter((t) => t.status === "DONE")
                .map((task) => (
                  <Task
                    task={task}
                    key={task.GUID}
                    projectName={projectName}
                    deleteTask={deleteTask}
                    editTask={editTaskToggle}
                    markAsDone={markAsDone}
                    assignUser={assignUser}
                    usersAvailable={users}
                  ></Task>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-white bg-cyan-800 dark:bg-zinc-800 p-4 w-1/3 text-center border-2 ">
            There are no tasks yet
          </div>
        )}
      </div>
    </>
  );
}
