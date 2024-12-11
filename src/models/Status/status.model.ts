export interface Status {
  id: number;
  name: string;
  color: string;
}

export interface StatusCreateDTO {
  name: string;
  color: string;
}

export interface StatusUpdateDTO extends StatusCreateDTO {
  id: number;
}
