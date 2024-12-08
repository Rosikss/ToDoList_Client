import api from "./api";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import { Status } from "@Status/status.model.ts";

export const fetchTodos = (): Promise<{ data: ToDo[] }> => api.get("/todo");
export const createTodo = (todo: ToDoCreateDTO): Promise<{ data: ToDo }> =>
  api.post("/todo", todo);
export const updateTodo = (id: number, todo: ToDoUpdateDTO): Promise<void> =>
  api.put(`/todo/${id}`, todo);
export const deleteTodo = (id: number): Promise<void> =>
  api.delete(`/todo/${id}`);
export const fetchStatuses = (): Promise<{ data: Status[] }> =>
  api.get("/status");
