import { UserType } from "./userType";

export type TaskType = {
  id: string;
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  storyId: string;
  expectedTime: number;
  status: "TODO" | "DOING" | "DONE";
  additonDate: Date;
  startDate?: Date;
  finishDate?: Date;
  User?: UserType;
};
