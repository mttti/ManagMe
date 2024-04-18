import { ProjectType } from "./Types/projectType";
import { StoryType } from "./Types/storyType";

export class ProjectApi {
  addProject(data: ProjectType) {
    if (data) {
      let projectTable: ProjectType[] = this.getAllProjects();
      projectTable.push(data);
      localStorage.setItem("projects", JSON.stringify(projectTable));
      return data;
    }
    throw new Error("Failed to add");
  }

  getProjectById(id: string) {
    let allProjects = this.getAllProjects();

    let project = allProjects.findIndex((p) => p.id === id);

    if (project) {
      return project;
    } else {
      throw new Error("Project not found");
    }
  }

  getAllProjects() {
    let allProjects: ProjectType[] = [];

    allProjects = JSON.parse(localStorage.getItem("projects")!);

    if (allProjects) {
      return allProjects;
    } else {
      throw new Error("There are no projects yet");
    }
  }

  updateProject(data: ProjectType) {
    let allProjects = this.getAllProjects();
    let projectId = allProjects.findIndex((p) => p.id === data.id);

    if (projectId >= 0) {
      allProjects[projectId] = data;
      localStorage.setItem("projects", JSON.stringify(allProjects));
      if (this.isPinned(data.id)) {
        this.addPinnedProject(data);
      }
      return 200;
    } else {
      throw new Error("Failed to update");
    }
  }

  deleteProject(id: string) {
    let allProjects = this.getAllProjects();
    let projectId = allProjects.findIndex((p) => p.id === id);

    if (projectId >= 0) {
      allProjects.splice(projectId, 1);
      localStorage.setItem("projects", JSON.stringify(allProjects));
      if (this.isPinned(id)) {
        localStorage.removeItem("pinnedProject");
      }
      return 200;
    } else {
      throw new Error("Can not delete this project");
    }
  }

  private isPinned(id: string) {
    let pinnedProject = this.getPinnedProject();
    if (pinnedProject.id === id) {
      return true;
    } else return false;
  }

  addPinnedProject(data: ProjectType) {
    if (data) {
      localStorage.setItem("pinnedProject", JSON.stringify(data));
      return 200;
    } else {
      throw new Error("Failed to pin project");
    }
  }

  getPinnedProject() {
    let pinnedProject: ProjectType = JSON.parse(
      localStorage.getItem("pinnedProject")!
    );

    if (pinnedProject) {
      return pinnedProject;
    } else {
      throw new Error("Project not found!");
    }
  }
}

export class StoryApi {
  addStory(data: StoryType) {
    if (data) {
      let storyTable: StoryType[] = localStorage.getItem("stories")
        ? JSON.parse(localStorage.getItem("stories")!)
        : [];
      storyTable.push(data);
      localStorage.setItem("stories", JSON.stringify(storyTable));
      return data;
    } else {
      throw new Error("Failed to add");
    }
  }

  getAllStories() {
    let allStories: StoryType[] = [];

    allStories = JSON.parse(localStorage.getItem("stories")!);

    if (allStories) {
      return allStories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  getStoryById(id: string) {
    let allStories: StoryType[] = localStorage.getItem("stories")
      ? JSON.parse(localStorage.getItem("stories")!)
      : [];
    let selectedStory = allStories.filter((s) => s.id === id);
    if (selectedStory) {
      return selectedStory;
    } else {
      throw new Error("Story not found");
    }
  }

  getStoriesByProjectId(projectId: string) {
    let allStories = this.getAllStories();
    let selectedStories = allStories.filter((s) => s.projectId === projectId);
    if (selectedStories.length > 0) {
      return selectedStories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  updateStory(data: StoryType) {
    let allStories = this.getAllStories();
    let storyId = allStories.findIndex((s) => s.id === data.id);

    if (storyId >= 0) {
      allStories[storyId] = data;
      localStorage.setItem("stories", JSON.stringify(allStories));
      return 200;
    } else {
      throw new Error("Failed to update");
    }
  }

  deleteStory(id: string) {
    let allStories = this.getAllStories();
    let storyId = allStories.findIndex((s) => s.id === id);

    if (storyId >= 0) {
      allStories.splice(storyId, 1);
      localStorage.setItem("stories", JSON.stringify(allStories));
      return 200;
    } else {
      throw new Error("Can not delete this story");
    }
  }
}
