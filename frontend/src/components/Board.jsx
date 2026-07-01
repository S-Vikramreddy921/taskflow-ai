import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { api } from "../api/api";

export default function Board({ board, setBoard }) {
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = board.columns.find((c) => String(c.id) === source.droppableId);
    const destColumn = board.columns.find((c) => String(c.id) === destination.droppableId);
    const movedTask = sourceColumn.tasks.find((t) => String(t.id) === draggableId);

    // Optimistic UI update
    const newColumns = board.columns.map((col) => {
      if (col.id === sourceColumn.id) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== movedTask.id) };
      }
      return col;
    }).map((col) => {
      if (col.id === destColumn.id) {
        const tasks = [...col.tasks];
        tasks.splice(destination.index, 0, movedTask);
        return { ...col, tasks };
      }
      return col;
    });

    setBoard({ ...board, columns: newColumns });

    try {
      await api.moveTask(movedTask.id, destColumn.id, destination.index);
    } catch (err) {
      console.error("Failed to persist move, reloading board state", err);
    }
  };

  const handleTaskCreated = (columnId, task) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
    );
    setBoard({ ...board, columns: newColumns });
  };

  const handleTaskDeleted = async (taskId) => {
    await api.deleteTask(taskId);
    const newColumns = board.columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => t.id !== taskId),
    }));
    setBoard({ ...board, columns: newColumns });
  };

  const handleColumnCleared = (columnId) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [] } : col
    );
    setBoard({ ...board, columns: newColumns });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {board.columns
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((column) => (
            <Column
              key={column.id}
              column={column}
              onTaskCreated={handleTaskCreated}
              onTaskDeleted={handleTaskDeleted}
              onColumnCleared={handleColumnCleared}
            />
          ))}
      </div>
    </DragDropContext>
  );
}
