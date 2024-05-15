import axios from "axios";
import { ProjectType } from "./Types/projectType";
import { StoryType } from "./Types/storyType";
import { TaskType } from "./Types/taskType";
import { jwtDecode } from "jwt-decode";

const URL = "http://localhost:3000";

axios.defaults.baseURL = URL;

const axiosGet = axios.create();

axiosGet.interceptors.request.use(
  async (cfg) => {
    //const userInfo = null;
    console.log("xddx");
    const userInfo = JSON.parse(localStorage.getItem("loggedUser")!);
    if (userInfo) {
      const currentDate = new Date();
      const decodedToken = jwtDecode(userInfo.accessToken);
      if (decodedToken.exp! * 1000 < currentDate.getTime()) {
        console.log("refresh");
        const response = await axios.post("/refreshToken", {
          refreshToken: userInfo.refreshToken,
        });
        userInfo.refreshToken = response.data.refreshToken;
        userInfo.accessToken = response.data.accessToken;
        localStorage.setItem("loggedUser", JSON.stringify(userInfo));
      }
    }

    return cfg;
  },
  (err) => {
    console.log(err);
  }
);

export class ProjectApi {
  async addProject(data: ProjectType) {
    if (data) {
      const response = await axios.post("/project", data);
      console.log(response.data);
      return response;
    }
    throw new Error("Failed to add");
  }

  async getProjectById(id: string) {
    // const response = await fetch(`${URL}/project/${id}`);
    const response = await axios.get(`/project${id}`);
    const object = await response.data;
    let project = object.data;
    if (project) {
      return project;
    } else {
      throw new Error("Project not found");
    }
  }

  async getAllProjects() {
    let allProjects: ProjectType[] = [];

    const response = await axios.get("/project");
    const object = response.data;
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
        await this.updatePinnedProject(data);
      }
      const response = await axios.put("/project", data);
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteProject(id: string) {
    if (id) {
      if (await this.isPinned(id)) {
        await this.deletePinnedProject(id);
      }
      const response = await axios.delete(`/project/${id}`);
      return response.data;
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
      const response = await axios.post("/pinnedProject", data);
      return await response.data;
    } else {
      throw new Error("Failed to pin project");
    }
  }

  async deletePinnedProject(id: string) {
    if (id) {
      const response = await axios.delete(`/pinnedProject/${id}`);
      return await response.data;
    } else {
      throw new Error("Can not delete this project");
    }
  }

  async updatePinnedProject(data: ProjectType) {
    if (data) {
      const response = await axios.put("/pinnedProject", data);
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async getPinnedProject() {
    const response = await axios.get("/pinnedProject");
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
  async addStory(data: StoryType) {
    if (data) {
      const response = await axios.post("/story", data);
      return await response.data;
    }
    throw new Error("Failed to add");
  }

  async getAllStories() {
    let allStories: StoryType[] = [];
    const response = await axios.get("/story");
    const object = await response.data;
    allStories = object.data;
    if (allStories) {
      return allStories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async getStoryById(id: string) {
    const response = await axios.get(`/story${id}`);
    const object = await response.data;
    let story = object.data;
    if (story) {
      return story;
    } else {
      throw new Error("Story not found");
    }
  }

  async getStoriesByProjectId(projectId: string) {
    const response = await axios.get(`/story/projectId/${projectId}`);
    const object = await response.data;
    let stories = object.data;
    if (stories.length > 0) {
      return stories;
    } else {
      throw new Error("There are no stories yet");
    }
  }

  async updateStory(data: StoryType) {
    if (data) {
      const response = await axios.put("/story", data);
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteStory(id: string) {
    if (id) {
      const response = await axios.delete(`/story/${id}`);
      return await response.data;
    } else {
      throw new Error("Can not delete this story");
    }
  }
}

export class TaskApi {
  async addTask(data: TaskType) {
    if (data) {
      const response = await axios.post("/task", data);
      return await response.data;
    } else {
      throw new Error("Failed to add");
    }
  }

  async getAllTasks() {
    let allTasks: TaskType[] = [];
    const response = await axios.get("/task");
    const object = await response.data;
    allTasks = object.data;

    if (allTasks) {
      return allTasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async getTaskById(id: string) {
    const response = await axios.get(`/task/${id}`);
    const object = await response.data;
    let selectedTask = object.data;
    if (selectedTask) {
      return selectedTask;
    } else {
      throw new Error("Task not found");
    }
  }

  async getTasksByStoryId(storyId: string) {
    const response = await axios.get(`/task/storyId/${storyId}`);
    const object = await response.data;
    let tasks = object.data;
    if (tasks.length > 0) {
      return tasks;
    } else {
      throw new Error("There are no tasks yet");
    }
  }

  async updateTask(data: TaskType) {
    if (data) {
      const response = await axios.put("/task", data);
      return await response.data;
    } else {
      throw new Error("Failed to update");
    }
  }

  async deleteTask(id: string) {
    if (id) {
      const response = await axios.delete(`/task/${id}`);
      return await response.data;
    } else {
      throw new Error("Can not delete this task");
    }
  }
}

export class UserApi {
  async getAllUsers() {
    const response = await axios.get("/user");
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
    const response = await axios.post("/login", data);

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
