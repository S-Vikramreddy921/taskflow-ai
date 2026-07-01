import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";

export default function Column({ column, onTaskCreated, onTaskDeleted }) {
  const [showAddModal, setShowAddModal] = useState(false);

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
