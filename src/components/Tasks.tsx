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
    task.status = "DOING";
    task.startDate = new Date();
    task.UserId = user.GUID;
    try {
      taskApi.updateTask(task);
      let taskIndex = allTasks.findIndex((t) => t.GUID === task.GUID);
      let tasks = [...allTasks];
      tasks[taskIndex] = task;
      setAllTasks(tasks);
    } catch (error) {}
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
      <div>
        <button
          className=" bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
          onClick={toggleModal}
        >
          Add a new task
        </button>
      </div>

      {hasTasks ? (
        <div className="flex justify-evenly mt-10">
          <div className="w-1/4 bg-purple-700 p-5">
            <h1 className="text-center text-2xl p-4">TODO</h1>
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
          <div className="w-1/4 bg-purple-700 p-5">
            <h1 className="text-center text-2xl p-4">DOING</h1>
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
          <div className="w-1/4 bg-purple-700 p-5">
            <h1 className="text-center text-2xl p-4">DONE</h1>
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
        <h1>There are no tasks yet</h1>
      )}
    </>
  );
}
