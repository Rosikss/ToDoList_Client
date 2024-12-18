﻿import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi.ts";
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from "@ToDo/todo.model.ts";
import "react-toastify/dist/ReactToastify.css";
import showErrorMessage from "@utils/ErrorToastMessage.ts";
import { AxiosError } from "axios";

class TodoStore {
  todos: ToDo[] = [];

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
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }

  async addTodo(todo: ToDo) {
    try {
      const { data } = await createTodo(todo as ToDoCreateDTO);
      runInAction(() => {
        data.statusName = todo.statusName;
        this.todos.push(data);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
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
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }

  async removeTodo(id: number) {
    try {
      await deleteTodo(id);
      runInAction(() => {
        this.todos = this.todos.filter((todo) => todo.id !== id);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }
}

export const todoStore = new TodoStore();
