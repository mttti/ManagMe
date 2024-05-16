import { useEffect, useState } from "react";
import { StoryApi } from "../api";
import { StoryType } from "../Types/storyType";
import StoryModal from "./Modals/StoryModal";
import Story from "./Story";

export default function Stories({ projectGuId }: { projectGuId: string }) {
  let storyApi = new StoryApi();
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedStory, setEditedStory] = useState<StoryType>();
  const [allStories, setAllStories] = useState<StoryType[]>([]);
  const [hasStories, setHasStories] = useState(true);

  useEffect(() => {
    async function getStories() {
      try {
        setAllStories(await storyApi.getStoriesByProjectId(projectGuId));
        setHasStories(true);
      } catch (error) {
        setHasStories(false);
      }
    }
    getStories();
  }, [isModalHidden, projectGuId]);

  function toggleModal() {
    setIsModalHidden((prevState) => !prevState);
    setEditedStory(undefined);
  }

  function addNewStory(story: StoryType) {
    setIsModalHidden(false);
    try {
      storyApi.addStory(story);
      setAllStories((prevState) => [story, ...prevState]);
      toggleModal();
    } catch (error) {
      //   console.log(error);
    }
  }
  function editStoryToggle(story: StoryType) {
    setEditedStory(story);
    setIsModalHidden(false);
  }
  function editStory(story: StoryType) {
    try {
      storyApi.updateStory(story);
      toggleModal();
    } catch (error) {}
  }

  function deleteStory(id: string) {
    try {
      storyApi.deleteStory(id);
      setAllStories((prevState) => prevState.filter((s) => s.GUID != id));
    } catch (error) {}
  }

  return (
    <>
      {!isModalHidden && (
        <StoryModal
          projectId={projectGuId}
          ownerId="owner"
          storyData={editedStory}
          isHidden={isModalHidden}
          toggleFunction={toggleModal}
          addStory={addNewStory}
          editStory={editStory}
        />
      )}
      <div className="flex flex-col items-center">
        <button
          onClick={toggleModal}
          className=" text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 my-5 rounded-xl flex cursor-pointer hover:bg-cyan-700 dark:hover:bg-zinc-700"
        >
          Add new story
        </button>
        {hasStories ? (
          <div className="flex justify-evenly mt-10 w-full">
            <div className="bg-cyan-800 dark:bg-zinc-800  border-2 border-white text-white w-1/4 p-3">
              <h1 className="text-center text-2xl">Planned stories</h1>

              {hasStories &&
                allStories
                  .filter((s) => s.status === "TODO")
                  .map((story) => (
                    <Story
                      story={story}
                      key={story.GUID}
                      deleteStory={deleteStory}
                      editStory={editStoryToggle}
                    ></Story>
                  ))}
            </div>
            <div className="bg-cyan-800 dark:bg-zinc-800  border-2 border-white text-white w-1/4 p-3">
              <h1 className="text-center text-2xl">Stories in progress</h1>

              {hasStories &&
                allStories
                  .filter((s) => s.status === "DOING")
                  .map((story) => (
                    <Story
                      story={story}
                      key={story.GUID}
                      deleteStory={deleteStory}
                      editStory={editStoryToggle}
                    ></Story>
                  ))}
            </div>
            <div className="bg-cyan-800 dark:bg-zinc-800  border-2 border-white text-white w-1/4 p-3">
              <h1 className="text-center text-2xl">Finished stories</h1>

              {hasStories &&
                allStories
                  .filter((s) => s.status === "DONE")
                  .map((story) => (
                    <Story
                      story={story}
                      key={story.GUID}
                      deleteStory={deleteStory}
                      editStory={editStoryToggle}
                    ></Story>
                  ))}
            </div>
          </div>
        ) : (
          <div className="text-white bg-cyan-800 dark:bg-zinc-800 p-4 w-1/3 text-center border-2">
            There are no stories yet
          </div>
        )}
      </div>
    </>
  );
}
