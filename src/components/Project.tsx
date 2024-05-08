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
    <div className="w-full bg-purple-700 border-2 border-white p-10">
      <p>Project name: {project.name}</p>
      <p>Project description: {project.description}</p>
      <p>Project id: {project.GUID}</p>
      <div className="flex justify-end">
        <button
          className="mr-5 cursor-pointer"
          onClick={() => pinProject(project)}
        >
          Pin the project
        </button>
        <button
          className="mr-5 cursor-pointer"
          onClick={() => editProject(project)}
        >
          Edit
        </button>
        <button
          className="cursor-pointer"
          onClick={() => deleteProject(project.GUID)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
