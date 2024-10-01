import DeleteIcon from "@/icons/DeleteIcon";
import PlusIcon from "@/icons/PlusIcon";
import { Column, Id, Task } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {useState } from "react";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  handleDeadLine: (id:Id, deadline:string)=>void
}
const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
    handleDeadLine
  } = props;
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
 
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        className="bg-gray-900 h-[500px] w-[350px] rounded-lg flex flex-col max-h-[350px] p-1 border-2 border-rose-500 opacity-40"
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }
  return (
    <div
      className="bg-gray-900 h-[40rem] w-[350px] rounded-lg flex flex-col  p-1"
      ref={setNodeRef}
      style={style}
      dir="rtl"
    >
      {/* title */}
      <div
        onClick={() => setEditMode(true)}
        {...attributes}
        {...listeners}
        className="text-md bg-gray-950 h-16 cursor-grab rounded-md rounded-b-none font-bold p-3 border-gray-800 border-4 flex items-center gap-2 justify-between"
      >
        <div className="flex gap-2 items-center">
         
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <DeleteIcon />
        </div>
      </div>
      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasks}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              handleDeadLine={handleDeadLine}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-2 rounded-md p-4 m-4 hover:bg-gray-950 hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        تسک جدید
      </button>
    </div>
  );
};

export default ColumnContainer;
