import { ProjectType } from "./Types/projectType";

export class API {
  addProject(data: ProjectType) {
    if (data) {
      let dataString = JSON.stringify(data);
      localStorage.setItem(data.id, dataString);
      return data;
    }
    throw new Error("Failed to add");
  }

  getProjectById(id: string) {
    let data: string | null = localStorage.getItem(id);
    if (data) {
      let parsedData = JSON.parse(data);
      return parsedData;
    }
    throw new Error("Data not found");
  }

  getAllProjects() {
    let allProjects: ProjectType[] = [];

    if (localStorage.length > 0) {
      for (let index = 0; index < localStorage.length; index++) {
        let project = JSON.parse(
          localStorage.getItem(localStorage.key(index)!)!
        );
        allProjects.push(project);
      }
      return allProjects;
    } else {
      throw new Error("There are no projects yet");
    }
  }

  updateProject(data: ProjectType) {
    let id = data.id;
    let isData: boolean = localStorage.getItem(id) ? true : false;

    if (isData) {
      let dataString = JSON.stringify(data);
      localStorage.setItem(id, dataString);
      return 200;
    } else {
      throw new Error("Failed to update");
    }
  }

  deleteProject(id: string) {
    let isData: boolean = localStorage.getItem(id) ? true : false;
    if (isData) {
      localStorage.removeItem(id);
      return 200;
    } else {
      throw new Error("Failed to delete");
    }
  }
}
