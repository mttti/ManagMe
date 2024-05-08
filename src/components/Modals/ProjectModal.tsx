import { useState } from "react";
import { ProjectType } from "../../Types/projectType";

export default function ProjectModal({
  projectData,
  isHidden,
  toggleFunction,
  addProject,
  editProject,
}: {
  projectData?: ProjectType;
  isHidden: boolean;
  toggleFunction: () => void;
  addProject: (project: ProjectType) => void;
  editProject: (project: ProjectType) => void;
}) {
  const [isModalHidden, setIsModalHidden] = useState(isHidden);
  const [projectName, setProjectName] = useState(
    projectData ? projectData.name : ""
  );
  const [projectDescription, setprojectDescription] = useState(
    projectData ? projectData.description : ""
  );
  function hide() {
    setIsModalHidden(true);
    toggleFunction();
  }

  function addProjectHandler() {
    if (projectName != "" && projectDescription != "") {
      const newProject: ProjectType = {
        GUID: crypto.randomUUID(),
        name: projectName,
        description: projectDescription,
      };
      addProject(newProject);
    }
  }

  function editProjectHandler() {
    if (projectName != "" && projectDescription != "" && projectData) {
      const editedProject: ProjectType = {
        GUID: projectData.GUID,
        name: projectName,
        description: projectDescription,
      };
      editProject(editedProject);
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
            <div className="flex w-1/3 h-60 rounded-md p-5 bg-purple-300 relative justify-evenly flex-col ">
              <input
                className="p-1"
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <input
                type="text"
                className="p-1"
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) => setprojectDescription(e.target.value)}
              />
              <div className="flex justify-evenly">
                <button
                  onClick={projectData ? editProjectHandler : addProjectHandler}
                  className="bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
                >
                  {projectData ? "Save" : "Add"}
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
