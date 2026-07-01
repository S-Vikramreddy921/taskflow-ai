import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import { api } from "../api/api";

export default function Column({ column, onTaskCreated, onTaskDeleted, onColumnCleared }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const isDoneColumn = column.name.trim().toLowerCase() === "done";

  const handleClearDone = async () => {
    if (column.tasks.length === 0) return;
    setClearing(true);
    try {
      await api.clearColumn(column.id);
      onColumnCleared(column.id);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.name}</h3>
        <span className="task-count">{column.tasks.length}</span>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onTaskDeleted} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
        + Add task
      </button>

      {isDoneColumn && column.tasks.length > 0 && (
        <button className="clear-done-btn" onClick={handleClearDone} disabled={clearing}>
          {clearing ? "Clearing..." : "Clear Done tasks"}
        </button>
      )}

      {showAddModal && (
        <AddTaskModal
          columnId={column.id}
          columnName={column.name}
          onClose={() => setShowAddModal(false)}
          onCreated={(task) => {
            onTaskCreated(column.id, task);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
