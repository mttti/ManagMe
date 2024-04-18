import { useEffect, useState } from "react";
import { ProjectType } from "../Types/projectType";
import { ProjectApi, StoryApi } from "../api";
import { StoryType } from "../Types/storyType";
import StoryModal from "./Modals/StoryModal";
import Story from "./Story";

export default function PinnedProject() {
  let projectApi = new ProjectApi();
  let storyApi = new StoryApi();
  let project: ProjectType | null;
  try {
    project = projectApi.getPinnedProject();
  } catch (error) {
    project = null;
  }

  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedStory, setEditedStory] = useState<StoryType>();
  const [allStories, setAllStories] = useState<StoryType[]>([]);
  const [hasStories, setHasStories] = useState(true);

  useEffect(() => {
    try {
      setAllStories(storyApi.getStoriesByProjectId(project?.id!));
      setHasStories(true);
    } catch (error) {
      setHasStories(false);
    }
  }, [isModalHidden]);

  function toggleModal() {
    setIsModalHidden((prevState) => !prevState);
    setEditedStory(undefined);
  }

  function addNewStory(story: StoryType) {
    setIsModalHidden(false);
    try {
      storyApi.addStory(story);
      setAllStories((prevState) => [story, ...prevState]);
      console.log(story);
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
      setAllStories((prevState) => prevState.filter((s) => s.id != id));
    } catch (error) {}
  }

  return (
    <>
      {!isModalHidden && (
        <StoryModal
          projectId={project?.id}
          ownerId="owner"
          storyData={editedStory}
          isHidden={isModalHidden}
          toggleFunction={toggleModal}
          addStory={addNewStory}
          editStory={editStory}
        />
      )}

      {project ? (
        <>
          <div className="w-full bg-purple-700 border-2 border-white p-10">
            <p>Project name: {project.name}</p>
            <p>Project description: {project.description}</p>
            <p>Project id: {project.id}</p>
          </div>
          <button
            onClick={toggleModal}
            className=" bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
          >
            Add new story
          </button>
          {hasStories ? (
            <div className="flex justify-evenly mt-10">
              <div className="bg-purple-400 w-1/4 p-3">
                <h1 className="text-center text-2xl">Planned stories</h1>

                {hasStories &&
                  allStories
                    .filter((s) => s.status === "TODO")
                    .map((story) => (
                      <Story
                        story={story}
                        key={story.id}
                        deleteStory={deleteStory}
                        editStory={editStoryToggle}
                      ></Story>
                    ))}
              </div>
              <div className="bg-purple-400 w-1/4 p-3 flex flex-col">
                <h1 className="text-center text-2xl">Stories in progress</h1>

                {hasStories &&
                  allStories
                    .filter((s) => s.status === "DOING")
                    .map((story) => (
                      <Story
                        story={story}
                        key={story.id}
                        deleteStory={deleteStory}
                        editStory={editStoryToggle}
                      ></Story>
                    ))}
              </div>
              <div className="bg-purple-400 w-1/4 p-3">
                <h1 className="text-center text-2xl">Finished stories</h1>

                {hasStories &&
                  allStories
                    .filter((s) => s.status === "DONE")
                    .map((story) => (
                      <Story
                        story={story}
                        key={story.id}
                        deleteStory={deleteStory}
                        editStory={editStoryToggle}
                      ></Story>
                    ))}
              </div>
            </div>
          ) : (
            <div className="bg-purple-400 p-4 w-1/3 text-center">
              There are no stories yet
            </div>
          )}
        </>
      ) : (
        "There is no pinned project"
      )}
    </>
  );
}
