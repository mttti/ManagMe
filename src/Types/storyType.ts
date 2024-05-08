export type StoryType = {
  GUID: string;
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  projectId: string;
  date: Date;
  status: "TODO" | "DOING" | "DONE";
  ownerId: string;
};
