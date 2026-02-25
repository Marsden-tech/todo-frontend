export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoRequest {
  title: string;
}