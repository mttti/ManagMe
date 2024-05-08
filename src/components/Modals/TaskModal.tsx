import { useState } from "react";
import { TaskType } from "../../Types/taskType";

//   isHidden,
//   toggleFunction,
//   addStory,
//   editStory,

//   isHidden: boolean;
//   toggleFunction: () => void;
//   addStory: (project: StoryType) => void;
//   editStory: (project: StoryType) => void;

export default function TaskModal({
  task,
  isHidden,
  storyId,
  toggleFunction,
  addTask,
  editTask,
}: {
  task?: TaskType;
  isHidden: boolean;
  storyId: string;
  toggleFunction: () => void;
  addTask: (task: TaskType) => void;
  editTask: (task: TaskType) => void;
}) {
  const [isModalHidden, setIsModalHidden] = useState(isHidden);
  const [taskName, setTaskName] = useState(task ? task.name : "");
  const [taskDesc, setTaskDesc] = useState(task ? task.description : "");
  const [taskPriority, setTaskPriority] = useState(
    task ? task.priority : "LOW"
  );
  const [taskStatus, setTaskStatus] = useState(task ? task.status : "TODO");
  const [taskExecTime, setTaskExecTime] = useState(
    task ? task.expectedTime : 0
  );

  function hide() {
    setIsModalHidden(true);
    toggleFunction();
  }

  function addTaskHandler() {
    if (taskName != "" && taskDesc != "" && taskExecTime != 0) {
      const newTask: TaskType = {
        GUID: crypto.randomUUID(),
        name: taskName,
        description: taskDesc,
        priority: taskPriority,
        storyId: storyId,
        expectedTime: taskExecTime,
        status: taskStatus,
        additionDate: new Date(),
      };
      addTask(newTask);
    }
  }
  function editTaskHandler() {
    if (taskName != "" && taskDesc != "" && taskExecTime != 0) {
      const editedTask: TaskType = {
        GUID: task?.GUID!,
        name: taskName,
        description: taskDesc,
        priority: taskPriority,
        storyId: storyId,
        expectedTime: taskExecTime,
        status: taskStatus,
        additionDate: task?.additionDate!,
        startDate: task?.startDate,
        finishDate: task?.finishDate,
        User: task?.User,
      };
      editTask(editedTask);
    }
  }

  return (
    <div className="fixed w-full h-full -mt-40">
      {!isModalHidden && (
        <>
          <div
            onClick={hide}
            className=" bg-black opacity-60 w-full h-full absolute"
          ></div>
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex w-1/3 h-fit rounded-md p-5 bg-purple-300 relative justify-evenly flex-col ">
              <input
                type="text"
                className="p-1 mt-5"
                placeholder="Task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <input
                type="text"
                className="p-1 mt-5"
                placeholder="Task description"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
              <input
                type="number"
                className="p-1 mt-5"
                placeholder="Expected execution time"
                value={taskExecTime}
                onChange={(e) => setTaskExecTime(parseInt(e.target.value))}
              />
              <p className=" mt-5">Priority:</p>
              <select
                name="priority"
                onChange={(e) =>
                  setTaskPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                }
              >
                <option value="LOW" defaultValue={"LOW"}>
                  LOW
                </option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <p>Status:</p>
              <select
                name="priority"
                onChange={(e) =>
                  setTaskStatus(e.target.value as "TODO" | "DOING" | "DONE")
                }
              >
                <option value="TODO" defaultValue={"TODO"}>
                  TODO
                </option>
                <option value="DOING">DOING</option>
                <option value="DONE">DONE</option>
              </select>
              <div className="flex justify-evenly mt-5">
                <button
                  onClick={task ? editTaskHandler : addTaskHandler}
                  className="bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
                >
                  {task ? "Save" : "Add"}
                </button>
                <button
                  onClick={hide}
                  className="bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
