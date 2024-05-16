import { useState } from "react";
import { StoryType } from "../../Types/storyType";

export default function StoryModal({
  ownerId,
  projectId,
  storyData,
  isHidden,
  toggleFunction,
  addStory,
  editStory,
}: {
  ownerId?: string;
  projectId?: string;
  storyData?: StoryType;
  isHidden: boolean;
  toggleFunction: () => void;
  addStory: (project: StoryType) => void;
  editStory: (project: StoryType) => void;
}) {
  const [isModalHidden, setIsModalHidden] = useState(isHidden);
  const [storyName, setStoryName] = useState(storyData ? storyData.name : "");
  const [storyDescription, setStoryDescription] = useState(
    storyData ? storyData.description : ""
  );
  const [storyPriority, setStoryPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    storyData ? storyData.priority : "LOW"
  );
  const [storyStatus, setStoryStatus] = useState<"TODO" | "DOING" | "DONE">(
    storyData ? storyData.status : "TODO"
  );

  function hide() {
    setIsModalHidden(true);
    toggleFunction();
  }

  function addStoryHandler() {
    if (storyName != "" && storyDescription != "" && typeof storyPriority) {
      const newStory: StoryType = {
        GUID: crypto.randomUUID(),
        name: storyName,
        description: storyDescription,
        priority: storyPriority,
        projectId: projectId!,
        date: new Date(),
        status: storyStatus,
        ownerId: ownerId!,
      };
      addStory(newStory);
    }
  }
  function editStoryHandler() {
    if (
      storyName != "" &&
      storyDescription != "" &&
      typeof storyPriority &&
      storyData
    ) {
      const editedStory: StoryType = {
        GUID: storyData.GUID!,
        name: storyName,
        description: storyDescription,
        priority: storyPriority,
        projectId: projectId!,
        date: new Date(),
        status: storyStatus,
        ownerId: ownerId!,
      };
      editStory(editedStory);
    }
  }
  return (
    <div className="fixed w-full h-dvh -ml-5 -mt-60 ">
      {!isModalHidden && (
        <>
          <div
            onClick={hide}
            className=" bg-black opacity-60 w-full h-full absolute"
          ></div>
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex w-1/3 h-60 rounded-md p-5 bg-cyan-700 dark:bg-zinc-700 relative justify-evenly flex-col ">
              <input
                className="p-1"
                type="text"
                placeholder="Story name"
                value={storyName}
                onChange={(e) => setStoryName(e.target.value)}
              />
              <input
                className="p-1"
                type="text"
                placeholder="Story description"
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
              />
              <select
                name="priority"
                onChange={(e) =>
                  setStoryPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                }
              >
                <option disabled selected>
                  Select priority
                </option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              <select
                name="status"
                onChange={(e) =>
                  setStoryStatus(e.target.value as "TODO" | "DOING" | "DONE")
                }
              >
                <option disabled selected>
                  Select status
                </option>
                <option value="TODO">TODO</option>
                <option value="DOING">DOING</option>
                <option value="DONE">DONE</option>
              </select>

              <div className="flex justify-evenly">
                <button
                  onClick={storyData ? editStoryHandler : addStoryHandler}
                  className="text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-cyan-900 dark:hover:bg-zinc-900"
                >
                  {storyData ? "Save" : "Add"}
                </button>
                <button
                  onClick={hide}
                  className="text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-cyan-900 dark:hover:bg-zinc-900"
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
