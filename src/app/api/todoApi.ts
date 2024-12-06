import api from "./api";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import { Status } from "@Status/status.model.ts";

export const fetchTodos = (): Promise<{ data: ToDo[] }> => api.get("/ToDo");
export const createTodo = (todo: ToDoCreateDTO): Promise<{ data: ToDo }> =>
  api.post("/ToDo", todo);
export const updateTodo = (id: number, todo: ToDoUpdateDTO): Promise<void> =>
  api.put(`/ToDo/${id}`, todo);
export const deleteTodo = (id: number): Promise<void> =>
  api.delete(`/ToDo/${id}`);
export const fetchStatuses = (): Promise<{ data: Status[] }> =>
  api.get("/Status");
