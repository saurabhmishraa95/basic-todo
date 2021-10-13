import { TaskDetail } from "./taskDetailModel";

export interface TodoListModel {
  createdAt: string;
  taskList: TaskDetail[];
}
