import { useEffect, useState } from "react";
import { ProjectType } from "../Types/projectType";
import { ProjectApi, StoryApi } from "../api";
import { StoryType } from "../Types/storyType";
import StoryModal from "./Modals/StoryModal";
import Story from "./Story";
import Stories from "./Stories";

export default function PinnedProject() {
  let projectApi = new ProjectApi();
  const [hasPinnedProject, setHasPinnedProject] = useState(false);
  const [pinnedProject, setPinnedProject] = useState<ProjectType>();

  useEffect(() => {
    async function getPinnedProject() {
      try {
        setPinnedProject(await projectApi.getPinnedProject());
        setHasPinnedProject(true);
      } catch {
        setHasPinnedProject(false);
      }
    }
    getPinnedProject();
  }, []);
  return (
    <>
      {hasPinnedProject ? (
        <>
          <div className="w-full bg-purple-700 border-2 border-white p-10">
            <p>Project name: {pinnedProject!.name}</p>
            <p>Project description: {pinnedProject!.description}</p>
            <p>Project id: {pinnedProject!.GUID}</p>
          </div>

          <Stories projectGuId={pinnedProject!.GUID}></Stories>
        </>
      ) : (
        <h1>There is no pinned project</h1>
      )}
    </>
  );
}
