import { useEffect, useState } from "react";
import { ProjectType } from "../Types/projectType";
import { ProjectApi } from "../api";
import Project from "./Project";
import ProjectModal from "./Modals/ProjectModal";

export default function Projects() {
  const api = new ProjectApi();
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [hasProjects, setHasProjects] = useState(true);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedProject, setEditedProject] = useState<ProjectType>();

  useEffect(() => {
    async function getProjects() {
      try {
        setAllProjects(await api.getAllProjects());
        setHasProjects(true);
      } catch (error) {
        setHasProjects(false);
      }
    }
    getProjects();
  }, [isModalHidden, editedProject]);

  function addNewProject(project: ProjectType) {
    setIsModalHidden(false);

    try {
      api.addProject(project);
      setAllProjects((prevState) => [project, ...prevState]);
      toggleModal();
    } catch (error) {}
  }

  function pinProject(project: ProjectType) {
    try {
      api.addPinnedProject(project);
    } catch (error) {}
  }

  function deleteProject(id: string) {
    try {
      api.deleteProject(id);
      setAllProjects((prevState) => prevState.filter((p) => p.GUID != id));
    } catch (error) {}
  }

  function editProjectToggle(project: ProjectType) {
    setEditedProject(project);
    setIsModalHidden(false);
  }

  function editProject(project: ProjectType) {
    try {
      api.updateProject(project);
      toggleModal();
    } catch (error) {}
  }

  function toggleModal() {
    setIsModalHidden((prevState) => !prevState);
    setEditedProject(undefined);
  }

  return (
    <>
      {!isModalHidden && (
        <ProjectModal
          projectData={editedProject}
          isHidden={isModalHidden}
          toggleFunction={toggleModal}
          addProject={addNewProject}
          editProject={editProject}
        />
      )}
      <div className="flex flex-col items-center ">
        <div
          onClick={toggleModal}
          className="bg-purple-400 w-fit p-3 rounded-xl flex cursor-pointer hover:bg-purple-500"
        >
          Add a new project
        </div>
        {hasProjects ? (
          allProjects.map((project) => (
            <Project
              key={project.GUID}
              project={project}
              deleteProject={deleteProject}
              editProject={editProjectToggle}
              pinProject={pinProject}
            />
          ))
        ) : (
          <div>There are no projects yet</div>
        )}
      </div>
    </>
  );
}
