import { ProjectType } from "./Types/projectType";
import { StoryType } from "./Types/storyType";
import { TaskType } from "./Types/taskType";
const URL = "http://localhost:3000";

export class ProjectApi {
  async addProject(data: ProjectType) {
    if (data) {
      const response = await fetch(`${URL}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    }
    throw new Error("Failed to add");
  }

  async getProjectById(id: string) {
    const response = await fetch(`${URL}/project/${id}`);
    const object = await response.json();
    let project = object.data;
    if (project) {
      return project;
    } else {
      throw new Error("Project not found");
    }
  }

  async getAllProjects() {
    let allProjects: ProjectType[] = [];
    const response = await fetch(`${URL}/project`);
    const object = await response.json();
    allProjects = object.data;
    if (allProjects) {
      return allProjects;
    } else {
      throw new Error("There are no projects yet");
    }
  }

  async updateProject(data: ProjectType) {
    if (data) {
      if (await this.isPinned(data.GUID)) {
        console.log(this.isPinned(data.GUID));
        await this.updatePinnedProject(data);
      }
      const response = await fetch(`${URL}/project`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteProject(id: string) {
    if (id) {
      if (await this.isPinned(id)) {
        await this.deletePinnedProject(id);
      }
      const response = await fetch(`${URL}/project/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } else {
      throw new Error("Can not delete this project");
    }
  }

  private async isPinned(id: string) {
    try {
      let pinnedProject = await this.getPinnedProject();
      if (pinnedProject.GUID === id) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }

  async addPinnedProject(data: ProjectType) {
    if (data) {
      const response = await fetch(`${URL}/pinnedProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to pin project");
    }
  }

  async deletePinnedProject(id: string) {
    if (id) {
      const response = await fetch(`${URL}/pinnedProject/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } else {
      throw new Error("Can not delete this project");
    }
  }

  async updatePinnedProject(data: ProjectType) {
    if (data) {
      console.log("update pined");
      const response = await fetch(`${URL}/pinnedProject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to update");
    }
  }

  async getPinnedProject() {
    const response = await fetch(`${URL}/pinnedProject`);
    const object = await response.json();
    const pinnedProject = object.data;
    if (pinnedProject) {
      return pinnedProject[0];
    } else {
      throw new Error("There is no pinned project yet");
    }
  }
}

export class StoryApi {
  async addStory(data: StoryType) {
    if (data) {
      const response = await fetch(`${URL}/story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    }
    throw new Error("Failed to add");
  }

  async getAllStories() {
    let allStories: StoryType[] = [];
    const response = await fetch(`${URL}/story`);
    const object = await response.json();
    allStories = object.data;
    if (allStories) {
      return allStories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async getStoryById(id: string) {
    const response = await fetch(`${URL}/story/${id}`);
    const object = await response.json();
    let story = object.data;
    if (story) {
      return story;
    } else {
      throw new Error("Story not found");
    }
  }

  async getStoriesByProjectId(projectId: string) {
    const response = await fetch(`${URL}/story/projectId/${projectId}`);
    const object = await response.json();
    let stories = object.data;
    if (stories.length > 0) {
      return stories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async updateStory(data: StoryType) {
    if (data) {
      const response = await fetch(`${URL}/story`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteStory(id: string) {
    if (id) {
      const response = await fetch(`${URL}/story/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } else {
      throw new Error("Can not delete this story");
    }
  }
}

export class TaskApi {
  async addTask(data: TaskType) {
    if (data) {
      const response = await fetch(`${URL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to add");
    }
  }

  async getAllTasks() {
    let allTasks: TaskType[] = [];

    const response = await fetch(`${URL}/task`);
    const object = await response.json();
    allTasks = object.data;

    if (allTasks) {
      return allTasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async getTaskById(id: string) {
    const response = await fetch(`${URL}/task/${id}`);
    const object = await response.json();
    let selectedTask = object.data;
    if (selectedTask) {
      return selectedTask;
    } else {
      throw new Error("Task not found");
    }
  }

  async getTasksByStoryId(storyId: string) {
    const response = await fetch(`${URL}/task/storyId/${storyId}`);
    const object = await response.json();
    let tasks = object.data;
    if (tasks.length > 0) {
      return tasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async updateTask(data: TaskType) {
    if (data) {
      const response = await fetch(`${URL}/task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteTask(id: string) {
    if (id) {
      const response = await fetch(`${URL}/task/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } else {
      throw new Error("Can not delete this task");
    }
  }
}

export class UserApi {
  static async getAllUsers() {
    const response = await fetch(`${URL}/user`);
    const object = await response.json();
    const allUsers = object.data;
    if (allUsers) {
      return allUsers;
    } else {
      throw new Error("There are no users yet");
    }
  }
}
