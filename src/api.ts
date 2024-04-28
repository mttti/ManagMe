import { ProjectType } from "./Types/projectType";
import { StoryType } from "./Types/storyType";
import { TaskType } from "./Types/taskType";
import { User } from "./User";

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

export class TaskApi {
  addTask(data: TaskType) {
    if (data) {
      let taskTable: TaskType[] = localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks")!)
        : [];
      taskTable.push(data);
      localStorage.setItem("tasks", JSON.stringify(taskTable));
      return data;
    } else {
      throw new Error("Failed to add");
    }
  }

  getAllTasks() {
    let allTasks: TaskType[] = [];

    allTasks = JSON.parse(localStorage.getItem("tasks")!);

    if (allTasks) {
      return allTasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  getTaskById(id: string) {
    let allTasks: TaskType[] = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")!)
      : [];
    let selectedTask = allTasks.filter((s) => s.id === id);
    if (selectedTask) {
      return selectedTask;
    } else {
      throw new Error("Task not found");
    }
  }

  getTasksByStoryId(storyId: string) {
    let tasks: TaskType[] = [
      {
        id: "string",
        name: "string",
        description: "string",
        priority: "LOW",
        storyId: "cee8aab1-4460-450e-b7fa-d953c4766ff0",
        expectedTime: 10,
        status: "TODO",
        additonDate: new Date(),
        startDate: new Date(),
        finishDate: new Date(),
        User: undefined,
      },
      {
        id: "strindg",
        name: "string",
        description: "string",
        priority: "LOW",
        storyId: "cee8aab1-4460-450e-b7fa-d953c4766ff0",
        expectedTime: 10,
        status: "TODO",
        additonDate: new Date(),
        startDate: new Date(),
        finishDate: new Date(),
        User: undefined,
      },
      {
        id: "stridng",
        name: "straing",
        description: "string",
        priority: "LOW",
        storyId: "cee8aab1-4460-450e-b7fa-d953c4766ff0",
        expectedTime: 10,
        status: "TODO",
        additonDate: new Date(),
        startDate: new Date(),
        finishDate: new Date(),
        User: undefined,
      },
    ];

    // return tasks;
    let allTasks: TaskType[] = this.getAllTasks();
    let selectedTasks = allTasks.filter((t) => t.storyId === storyId);
    if (selectedTasks.length > 0) {
      return selectedTasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  updateTask(data: TaskType) {
    let allTasks = this.getAllTasks();
    let taskId = allTasks.findIndex((s) => s.id === data.id);

    if (taskId >= 0) {
      allTasks[taskId] = data;
      localStorage.setItem("tasks", JSON.stringify(allTasks));
      return 200;
    } else {
      throw new Error("Failed to update");
    }
  }

  deleteTask(id: string) {
    let allTasks = this.getAllTasks();
    let taskId = allTasks.findIndex((s) => s.id === id);

    if (taskId >= 0) {
      allTasks.splice(taskId, 1);
      localStorage.setItem("tasks", JSON.stringify(allTasks));
      return 200;
    } else {
      throw new Error("Can not delete this task");
    }
  }
}

export class UserApi {
  static getAllUsers() {
    const users = [
      new User("Jan", "Kowalski", "ADMIN"),
      new User("Karol", "Mickiewicz", "DEVELOPER"),
      new User("Bartek", "Ptak", "DEVOPS"),
    ];

    localStorage.setItem("users", JSON.stringify(users));

    return JSON.parse(localStorage.getItem("users")!);
  }
}
