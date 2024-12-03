export interface ToDo {
    id: number;
    title: string;
    createdAt: string;
    dueDate: string;
    description: string;
    statusId: number;
    statusName: string;
}

export interface ToDoCreateDTO {
    title: string;
    createdAt: string;
    dueDate: string;
    description: string;
    statusId: number;
}

export interface ToDoUpdateDTO extends ToDoCreateDTO{
    id: number;
}