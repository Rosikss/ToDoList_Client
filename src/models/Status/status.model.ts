export interface Status {
    id: number;
    name: string;
}


export interface StatusCreateDTO {
    name: string;
}

export interface StatusUpdateDTO extends StatusCreateDTO {
    id: number;
}

