export type TaskType = {
  GUID: string;
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  storyId: string;
  expectedTime: number;
  status: "TODO" | "DOING" | "DONE";
  additionDate: Date;
  startDate?: Date;
  finishDate?: Date;
  UserId: string | undefined;
};
