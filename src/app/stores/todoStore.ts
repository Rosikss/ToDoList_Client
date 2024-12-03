import { makeAutoObservable } from 'mobx';
import { fetchTodos, createTodo, updateTodo, deleteTodo, fetchStatuses } from '../api/todoApi';
import { ToDo, ToDoCreateDTO, ToDoUpdateDTO } from '../../models/ToDo/todo.model';
import { Status } from '../../models/Status/status.model';

class TodoStore {
    todos: ToDo[] = [];
    statuses: Status[] = [];

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async loadTodos() {
        try {
            const { data } = await fetchTodos();
            this.todos = data;
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }

    async loadStatuses() {
        try {
            const { data } = await fetchStatuses();
            this.statuses = data;
        } catch (error) {
            console.error('Error loading statuses:', error);
        }
    }

    async addTodo(todo: ToDoCreateDTO) {
        try {
            const { data } = await createTodo(todo);
            this.todos.push(data);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async editTodo(id: number, updatedTodo: ToDoUpdateDTO) {
        try {
            await updateTodo(id, updatedTodo);
            this.todos = this.todos.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }

    async removeTodo(id: number) {
        try {
            await deleteTodo(id);
            this.todos = this.todos.filter(todo => todo.id !== id);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }
}

export const todoStore = new TodoStore();
