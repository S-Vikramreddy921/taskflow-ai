import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_COLORS = {
  LOW: "#4b7bec",
  MEDIUM: "#f7b731",
  HIGH: "#eb3b5a",
};

function formatDueDate(dueDate) {
  // dueDate is "YYYY-MM-DD" from the backend
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = due < today;
  const label = due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { label, isOverdue };
}

export default function TaskCard({ task, index, onDelete }) {
  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

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
          {dueInfo && (
            <span className={`due-badge ${dueInfo.isOverdue ? "due-overdue" : ""}`}>
              {dueInfo.isOverdue ? "Overdue: " : "Due "}
              {dueInfo.label}
            </span>
          )}
        </div>
      )}
    </Draggable>
  );
}
