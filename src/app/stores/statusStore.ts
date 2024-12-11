import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteStatus,
  createStatus,
  updateStatus,
  fetchStatuses,
} from "../api/statusApi.ts";
import {
  Status,
  StatusCreateDTO,
  StatusUpdateDTO,
} from "@Status/status.model.ts";
import "react-toastify/dist/ReactToastify.css";
import showErrorMessage from "@utils/ErrorToastMessage.ts";
import { AxiosError } from "axios";

class StatusStore {
  statuses: Status[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadStatuses() {
    try {
      const { data } = await fetchStatuses();
      runInAction(() => {
        this.statuses = data;
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }

  async addStatus(status: StatusCreateDTO) {
    try {
      const { data } = await createStatus(status);
      runInAction(() => {
        this.statuses.push(data);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }

  async editStatus(id: number, updatedStatus: StatusUpdateDTO) {
    try {
      await updateStatus(id, updatedStatus);
      runInAction(() => {
        this.statuses = this.statuses.map((status) =>
          status.id === id ? { ...status, ...updatedStatus } : status,
        );
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }

  async removeStatus(id: number) {
    try {
      await deleteStatus(id);
      runInAction(() => {
        this.statuses = this.statuses.filter((status) => status.id !== id);
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        showErrorMessage(error);
      }
    }
  }
}

export const statusStore = new StatusStore();
