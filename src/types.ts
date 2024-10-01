export type Column = {
  id: Id;
  title: string;
};
export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  deadline:string
  overdue?:boolean
};

export type Id = string | number;
