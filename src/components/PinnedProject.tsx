import { useEffect, useState } from "react";
import { ProjectType } from "../Types/projectType";
import { ProjectApi, StoryApi } from "../api";
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
    <div className="p-5">
      {hasPinnedProject ? (
        <>
          <div className="w-full bg-cyan-800 dark:bg-zinc-800  border-2 border-white p-10 text-white">
            <p className="text-2xl mb-3">Project name: {pinnedProject!.name}</p>
            <p className="text-2xl">
              Project description: {pinnedProject!.description}
            </p>
          </div>

          <Stories projectGuId={pinnedProject!.GUID}></Stories>
        </>
      ) : (
        <h1>There is no pinned project</h1>
      )}
    </div>
  );
}
