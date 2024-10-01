"use client";
import PlusIcon from "@/icons/PlusIcon";
import { Column, Id, Task } from "@/types";
import React, { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const Board = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `ستون ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
    console.log(columns);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };
  const deleteColumn = (id: Id) => {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };
  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      columnId,
      content: `تسک ${tasks.length + 1}`,
      id: generateId(),
    };
    setTasks([...tasks, newTask]);
  };
  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };
  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };
  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };
  const onDragEnd = (e: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { over, active } = e;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId == overColumnId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id == activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id == overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  const onDragOver = (e: DragOverEvent) => {
    const { over, active } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId == overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    //dropping over another task
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id == activeId);
        const overIndex = tasks.findIndex((t) => t.id == overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type == "Column";

    //dropping over another column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id == activeId);
        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };
  return (
    <div className="min-h-screen m-auto flex w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <div key={col.id}>
                <ColumnContainer
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              </div>
            ))}
          </SortableContext>
          <button
            dir="rtl"
            className="h-16 w-[350px] min-w-[350px] cursor-pointer rounded-lg p-4 bg-zinc-900 border-2 ring-rose-500 hover:ring-2 flex gap-2 items-center"
            onClick={createNewColumn}
          >
            <div className="flex size-6">
              <PlusIcon />
            </div>
            <span>ستون جدید</span>
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
        document.body
        )}
      </DndContext>
    </div>
  );
};

export default Board;
