import { ProjectType } from "../Types/projectType";

export default function Project({
  project,
  deleteProject,
  editProject,
  pinProject,
}: {
  project: ProjectType;
  deleteProject: (id: string) => void;
  editProject: (project: ProjectType) => void;
  pinProject: (project: ProjectType) => void;
}) {
  return (
    <div className="w-full bg-cyan-800 dark:bg-zinc-800  border-2 border-white p-10 text-white mb-5">
      <p className="text-2xl mb-3">Project name: {project.name}</p>
      <p className="text-2xl">Project description: {project.description}</p>
      <div className="flex justify-end">
        <button
          className="mr-5 cursor-pointer bg-cyan-600 dark:bg-zinc-600 p-3 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700"
          onClick={() => pinProject(project)}
        >
          Pin the project
        </button>
        <button
          className="mr-5 cursor-pointer bg-cyan-600 dark:bg-zinc-600 p-3 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700"
          onClick={() => editProject(project)}
        >
          Edit
        </button>
        <button
          className="cursor-pointer bg-cyan-600 dark:bg-zinc-600 p-3 rounded-md hover:bg-cyan-700 dark:hover:bg-zinc-700"
          onClick={() => deleteProject(project.GUID)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
