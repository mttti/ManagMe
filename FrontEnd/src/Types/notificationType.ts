export type notificationType = {
  GUID: string;
  title: string;
  date: Date;
  priority: "LOW" | "MEDIUM" | "HIGH";
  read: 0 | 1;
  userId: string;
};
