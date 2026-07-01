import React, { useState } from "react";
import { api } from "../api/api";

export default function AddTaskModal({ columnId, columnName, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAiSuggest = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const suggestion = await api.suggestTask(title, columnName);
      setDescription(suggestion.suggestedDescription);
      setPriority(suggestion.suggestedPriority);
    } catch (err) {
      setAiError(
        err.response?.data?.error || "AI suggestion failed. Is ANTHROPIC_API_KEY set on the backend?"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const task = await api.createTask({ title, description, priority, columnId });
    onCreated(task);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add task to "{columnName}"</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Write API integration tests"
          />

          <div className="ai-row">
            <button
              type="button"
              className="ai-suggest-btn"
              onClick={handleAiSuggest}
              disabled={aiLoading || !title.trim()}
            >
              {aiLoading ? "Thinking..." : "✨ AI Suggest description & priority"}
            </button>
          </div>
          {aiError && <p className="ai-error">{aiError}</p>}

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="secondary-btn">
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
