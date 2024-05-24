import { useEffect, useState } from "react";
import { ProjectType } from "../Types/projectType";
import { ProjectApi } from "../api";
import Project from "./Project";
import ProjectModal from "./Modals/ProjectModal";
import { useAuthContext } from "../hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";

export default function Projects() {
  const api = new ProjectApi();
  const context = useAuthContext();
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [hasProjects, setHasProjects] = useState(true);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [editedProject, setEditedProject] = useState<ProjectType>();
  const [userToken, setUserToken] = useState(context.user.accessToken);
  const [userRole, setUserRole] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    setIsFetching(true);
    setUserToken(context.user ? context.user.accessToken : null);
    if (userToken) {
      const decodedToken: { userRole: string } = jwtDecode(userToken);
      setUserRole(decodedToken.userRole);
      setIsFetching(false);
    }
  }, [context]);

  useEffect(() => {
    async function getProjects() {
      try {
        if (!isFetching) {
          setAllProjects(await api.getAllProjects(userToken));
          setHasProjects(true);
          setIsFetching(false);
        }
      } catch (error) {
        setHasProjects(false);
      }
    }
    getProjects();
  }, [isModalHidden, editedProject, userRole, isFetching]);

  function addNewProject(project: ProjectType) {
    setIsModalHidden(false);

    try {
      api.addProject(project, userToken);
      setAllProjects((prevState) => [project, ...prevState]);
      toggleModal();
    } catch (error) {}
  }

  function pinProject(project: ProjectType) {
    try {
      api.addPinnedProject(project, userToken);
    } catch (error) {}
  }

  function deleteProject(id: string) {
    try {
      api.deleteProject(id, userToken);
      setAllProjects((prevState) => prevState.filter((p) => p.GUID != id));
    } catch (error) {}
  }

  function editProjectToggle(project: ProjectType) {
    setEditedProject(project);
    setIsModalHidden(false);
  }

  function editProject(project: ProjectType) {
    try {
      api.updateProject(project, userToken);
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
      <div className="flex flex-col items-center my-5 px-5 ">
        {userRole !== "DEVELOPER" ? (
          <div
            onClick={toggleModal}
            className="text-white bg-cyan-800 dark:bg-zinc-800 w-fit p-3 mb-5 rounded-xl flex cursor-pointer hover:bg-cyan-700 dark:hover:bg-zinc-700"
          >
            Add a new project
          </div>
        ) : (
          ""
        )}

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
          <div className="text-black dark:text-white mt-10 text-3xl">
            There are no projects yet...
          </div>
        )}
      </div>
    </>
  );
}
