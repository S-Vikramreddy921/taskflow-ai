import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_COLORS = {
  LOW: "#4b7bec",
  MEDIUM: "#f7b731",
  HIGH: "#eb3b5a",
};

export default function TaskCard({ task, index, onDelete }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
          }}
        >
          <div className="task-card-header">
            <span
              className="priority-dot"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
              title={task.priority}
            />
            <span className="task-title">{task.title}</span>
            <button className="task-delete" onClick={() => onDelete(task.id)}>
              ×
            </button>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
        </div>
      )}
    </Draggable>
  );
}
