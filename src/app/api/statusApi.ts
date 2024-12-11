import api from "./api.ts";
import {
  Status,
  StatusCreateDTO,
  StatusUpdateDTO,
} from "@Status/status.model.ts";

export const createStatus = (
  status: StatusCreateDTO,
): Promise<{ data: Status }> => api.post("/status", status);
export const updateStatus = (
  id: number,
  status: StatusUpdateDTO,
): Promise<void> => api.put(`/status/${id}`, status);
export const deleteStatus = (id: number): Promise<void> =>
  api.delete(`/status/${id}`);
export const fetchStatuses = (): Promise<{ data: Status[] }> =>
  api.get("/status");
