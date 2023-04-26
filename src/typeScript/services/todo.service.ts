import axios from "axios";
import AppView from "../views/appView";

import TodoSchema from "../models/todoModel";
import TOAST from "../helper/toast";
import MESSAGE from "../constants/message";
import { ITodo } from "../constants/interface";
import { TodoData } from "../constants/types";

class TodoService {
  todos: ITodo[];
  AppView: AppView;
  endpoint: string;
  constructor() {
    this.todos = [];
    this.AppView = new AppView();
    this.endpoint = `${process.env.BASE_URL}/todoList`;
  }

  async getAlltodo(): Promise<void> {
    const endpointUrl = this.endpoint;

    try {
      const { data }: { data: ITodo[] } = await axios.get(endpointUrl);

      if (data) {
        this.todos = data.map((todo: ITodo) => new TodoSchema(todo));
      }
    } catch (error) {
      this.AppView.createToast(TOAST.ERROR(error));
    }
  }

  async getTodoByEmail(email: string): Promise<void> {
    const endpointUrl = `${this.endpoint}?email=${email}`;

    try {
      const { data }: { data: ITodo[] } = await axios.get(endpointUrl);

      if (data) {
        this.todos = data.map((todo: ITodo) => new TodoSchema(todo));
      }
    } catch (error) {
      this.AppView.createToast(TOAST.ERROR(error));
    }
  }

  async addTodo(todo: ITodo): Promise<ITodo> {
    const endpointUrl = this.endpoint;

    try {
      const { data }: { data: ITodo } = await axios.post(endpointUrl, todo);

      if (data) {
        this.todos.push(data);
      }
      this.AppView.createToast(TOAST.SUCCESS(MESSAGE.ADD_TODO_SUCCESS));
      return data;
    } catch (error) {
      this.AppView.createToast(TOAST.ERROR(error));
      throw error;
    }
  }

  async updateTodo(id: string, todoData: TodoData): Promise<ITodo> {
    const endpointUrl = `${this.endpoint}/${id}`;

    try {
      const { data }: { data: ITodo } = await axios.patch(
        endpointUrl,
        todoData
      );
      this.AppView.createToast(TOAST.SUCCESS(MESSAGE.UPDATE_TODO_SUCCESS));
      return data;
    } catch (error) {
      this.AppView.createToast(TOAST.ERROR(error));
      throw error;
    }
  }

  async removeTodo(id: string): Promise<void> {
    const endpointUrl = `${this.endpoint}/${id}`;
    try {
      await axios.delete(endpointUrl);
      this.todos = this.todos.filter((todo: ITodo) => todo.id !== id);
      this.AppView.createToast(TOAST.SUCCESS(MESSAGE.DELETE_TODO_SUCCESS));
    } catch (error) {
      this.AppView.createToast(TOAST.ERROR(error));
    }
  }

  logoutSuccess = (): void => {
    this.AppView.createToast(TOAST.SUCCESS(MESSAGE.LOGOUT_SUCCESS));
  };
}

export default TodoService;
