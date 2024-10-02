"use client";
import DeleteIcon from "@/icons/DeleteIcon";
import { Id, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  handleDeadLine: (id: Id, deadline: string) => void;
}
const TaskCard = (props: Props) => {
  const { task, deleteTask, updateTask, handleDeadLine } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        className="bg-gray-800 p-2.5 h-[100px] min-h-[100px] items-center flex text-right rounded-xl  border-2 border-rose-500 cursor-grab relative opacity-50"
        ref={setNodeRef}
        style={style}
      />
    );
  }
  if (editMode) {
    return (
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        dir="rtl"
        className="bg-gray-800 p-2.5 h-[100px] min-h-[100px] items-center flex text-right rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="محتوای تسک را اینجا وارد کنید"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }
  return (
    <div>
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        onClick={toggleEditMode}
        dir="rtl"
        className="bg-gray-800 p-2.5 h-[100px] min-h-[100px] items-center flex text-right rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
      >
        {task.content}
        {mouseIsOver && (
          <button
            className="stroke-white absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded transition opacity-60 hover:opacity-100"
            onClick={() => deleteTask(task.id)}
          >
            <DeleteIcon />
          </button>
        )}
      </div>
      {task.deadline !== "" ? (
        <div className="flex justify-between px-2 items-center mt-2 w-full">
          <span>ددلاین مشخص شده:</span>

          <span
            onClick={() => handleDeadLine(task.id, "")}
            className="hover:cursor-pointer hover:text-rose-500 transition"
          >
            {task.deadline}
          </span>
        </div>
      ) : (
        <div className="flex justify-between w-full items-center mt-2">
          <span>تعیین ددلاین:</span>
          <input
            type="date"
            className=" bg-transparent hover:bg-rose-500 p-2 rounded"
            value={task?.deadline}
            onChange={(e) => handleDeadLine(task.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
