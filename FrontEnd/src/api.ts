import axios from "axios";
import { ProjectType } from "./Types/projectType";
import { StoryType } from "./Types/storyType";
import { TaskType } from "./Types/taskType";

const URL = "http://localhost:3000";

axios.defaults.baseURL = URL;

export class ProjectApi {
  async addProject(data: ProjectType, token: string) {
    if (data) {
      const response = await axios.post("/project", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    }
    throw new Error("Failed to add");
  }

  async getProjectById(id: string, token: string) {
    const response = await axios.get(`/project${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    let project = object.data;
    if (project) {
      return project;
    } else {
      throw new Error("Project not found");
    }
  }

  async getAllProjects(token: string) {
    let allProjects: ProjectType[] = [];

    const response = await axios.get("/project", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const object = response.data;
    allProjects = object.data;
    if (allProjects) {
      return allProjects;
    } else {
      throw new Error("There are no projects yet");
    }
  }

  async updateProject(data: ProjectType, token: string) {
    if (data) {
      if (await this.isPinned(data.GUID, token)) {
        await this.updatePinnedProject(data, token);
      }
      const response = await axios.put("/project", data);
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteProject(id: string, token: string) {
    if (id) {
      if (await this.isPinned(id, token)) {
        await this.deletePinnedProject(id, token);
      }
      const response = await axios.delete(`/project/${id}`);
      return response.data;
    } else {
      throw new Error("Can not delete this project");
    }
  }

  private async isPinned(id: string, token: string) {
    try {
      let pinnedProject = await this.getPinnedProject(token);
      if (pinnedProject.GUID === id) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }

  async addPinnedProject(data: ProjectType, token: string) {
    if (data) {
      const response = await axios.post("/pinnedProject", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Failed to pin project");
    }
  }

  async deletePinnedProject(id: string, token: string) {
    if (id) {
      const response = await axios.delete(`/pinnedProject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.data;
    } else {
      throw new Error("Can not delete this project");
    }
  }

  async updatePinnedProject(data: ProjectType, token: string) {
    if (data) {
      const response = await axios.put("/pinnedProject", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async getPinnedProject(token: string) {
    const response = await axios.get("/pinnedProject", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    const object = await response.data;
    const pinnedProject = object.data;
    if (pinnedProject) {
      return pinnedProject[0];
    } else {
      throw new Error("There is no pinned project yet");
    }
  }
}

export class StoryApi {
  async addStory(data: StoryType, token: string) {
    if (data) {
      const response = await axios.post("/story", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    }
    throw new Error("Failed to add");
  }

  async getAllStories(token: string) {
    let allStories: StoryType[] = [];
    const response = await axios.get("/story", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    allStories = object.data;
    if (allStories) {
      return allStories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async getStoryById(id: string, token: string) {
    const response = await axios.get(`/story${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    let story = object.data;
    if (story) {
      return story;
    } else {
      throw new Error("Story not found");
    }
  }

  async getStoriesByProjectId(projectId: string, token: string) {
    const response = await axios.get(`/story/projectId/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    let stories = object.data;
    if (stories.length > 0) {
      return stories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async updateStory(data: StoryType, token: string) {
    if (data) {
      const response = await axios.put("/story", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteStory(id: string, token: string) {
    if (id) {
      const response = await axios.delete(`/story/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Can not delete this story");
    }
  }
}

export class TaskApi {
  async addTask(data: TaskType, token: string) {
    if (data) {
      const response = await axios.post("/task", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Failed to add");
    }
  }

  async assignTaskToUser(
    taskId: string,
    projectId: string,
    userId: string,
    token: string
  ) {
    if (taskId && projectId && userId) {
      const response = await axios.post(
        "/assignTask",
        { taskId, projectId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } else {
      throw new Error("Failed to add");
    }
  }

  async getAllTasks(token: string) {
    let allTasks: TaskType[] = [];
    const response = await axios.get("/task", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    allTasks = object.data;

    if (allTasks) {
      return allTasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async getTaskById(id: string, token: string) {
    const response = await axios.get(`/task/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    let selectedTask = object.data;
    if (selectedTask) {
      return selectedTask;
    } else {
      throw new Error("Task not found");
    }
  }

  async getTasksByStoryId(storyId: string, token: string) {
    const response = await axios.get(`/task/storyId/${storyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    let tasks = object.data;
    if (tasks.length > 0) {
      return tasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async updateTask(data: TaskType, token: string) {
    if (data) {
      const response = await axios.put("/task", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteTask(id: string, token: string) {
    if (id) {
      const response = await axios.delete(`/task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    } else {
      throw new Error("Can not delete this task");
    }
  }
}

export class UserApi {
  async getAllUsers(token: string) {
    const response = await axios.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const object = await response.data;
    const allUsers = object.data;
    if (allUsers) {
      return allUsers;
    } else {
      throw new Error("There are no users yet");
    }
  }

  async login(login: string, password: string) {
    const data = {
      login: login,
      password: password,
    };
    try {
      const response = await axios.post("/login", data);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async googleLogin(id: string, email: string, name: string) {
    const data = {
      id: id,
      email: email,
      name: name,
    };
    const response = await axios.post("/googleLogin", data);

    return response.data;
  }

  async logout(token: string, refreshToken: string) {
    const response = await axios.post(
      "/logout",
      { token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export class NotificationApi {
  async markAsRead(token: string, GUID: string) {
    if (GUID) {
      const response = await axios.post(
        "/markAsRead",
        { GUID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }
}
