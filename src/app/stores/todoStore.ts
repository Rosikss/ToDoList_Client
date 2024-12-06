import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  fetchStatuses,
} from "../api/todoApi";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import { Status } from "@Status/status.model.ts";
import "react-toastify/dist/ReactToastify.css";
import showErrorMessage from "@utils/ErrorToastMessage.ts";

class TodoStore {
  todos: ToDo[] = [];
  statuses: Status[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadTodos() {
    try {
      const { data } = await fetchTodos();
      runInAction(() => {
        this.todos = data;
      });
    } catch (error) {
      showErrorMessage(error);
    }
  }

  async loadStatuses() {
    try {
      const { data } = await fetchStatuses();
      runInAction(() => {
        this.statuses = data;
      });
    } catch (error) {
      showErrorMessage(error);
    }
  }

  async addTodo(todo: ToDoCreateDTO) {
    try {
      const { data } = await createTodo(todo);
      runInAction(() => {
        this.todos.push(data);
      });
    } catch (error) {
      showErrorMessage(error);
    }
  }

  async editTodo(id: number, updatedTodo: ToDoUpdateDTO) {
    try {
      await updateTodo(id, updatedTodo);
      runInAction(() => {
        this.todos = this.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo,
        );
      });
    } catch (error) {
      showErrorMessage(error);
    }
  }

  async removeTodo(id: number) {
    try {
      await deleteTodo(id);
      runInAction(() => {
        this.todos = this.todos.filter((todo) => todo.id !== id);
      });
    } catch (error) {
      showErrorMessage(error);
    }
  }
}

export const todoStore = new TodoStore();
