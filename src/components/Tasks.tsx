import { useLocation, useParams } from "react-router-dom";
import { StoryType } from "../Types/storyType";
import { ProjectApi, TaskApi } from "../api";
import Task from "./Task";
import { useEffect, useState } from "react";
import { TaskType } from "../Types/taskType";
import TaskModal from "./Modals/TaskModal";
import { UserType } from "../Types/userType";

export default function Tasks() {
  const [hasTasks, setHasTasks] = useState(true);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedTask, setEditedTask] = useState<TaskType>();
  const [projectName, setProjectName] = useState("");
  let taskApi = new TaskApi();
  let projectApi = new ProjectApi();

  let { storyId } = useParams();
  useEffect(() => {
    async function get() {
      try {
        const pinnedProject = await projectApi.getPinnedProject();
        setProjectName(pinnedProject.name);
        setAllTasks(await taskApi.getTasksByStoryId(storyId!));
      } catch (error) {
        setHasTasks(false);
      }
    }
    get();
  }, [storyId, isModalHidden]);

  function addNewTask(task: TaskType) {
    setIsModalHidden(false);
    try {
      taskApi.addTask(task);
      console.log(task);
      setAllTasks((prevState) => [task, ...prevState]);
      toggleModal();
    } catch (error) {}
  }

  function editTask(task: TaskType) {
    try {
      taskApi.updateTask(task);
      toggleModal();
    } catch (error) {}
  }

  function editTaskToggle(task: TaskType) {
    setEditedTask(task);
    setIsModalHidden(false);
  }

  function assignUser(task: TaskType, user: UserType) {
    const updatedTask = { ...task };
    updatedTask.status = "DOING";
    updatedTask.startDate = new Date();

    updatedTask.UserId = user.GUID;
    try {
      taskApi.updateTask(updatedTask);
      let taskIndex = allTasks.findIndex((t) => t.GUID === task.GUID);
      let tasks = [...allTasks];
      tasks[taskIndex] = task;
      setAllTasks(tasks);
    } catch (error) {
      console.log(error);
    }
  }

  function deleteTask(id: string) {
    try {
      taskApi.deleteTask(id);
      setAllTasks((prevState) => prevState.filter((s) => s.GUID != id));
    } catch (error) {}
  }

  function markAsDone(task: TaskType) {
    task.status = "DONE";
    task.finishDate = new Date();
    try {
      taskApi.updateTask(task);
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
          <button
            className=" text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 my-5 rounded-xl flex cursor-pointer hover:bg-cyan-700 dark:hover:bg-zinc-700"
            onClick={toggleModal}
          >
            Add a new task
          </button>
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
                  ></Task>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-white bg-cyan-800 dark:bg-zinc-800 p-4 w-1/3 text-center border-2 ">
            There are no stories yet
          </div>
        )}
      </div>
    </>
  );
}
