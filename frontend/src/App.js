import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import { api } from "./api/api";

const DEMO_BOARD_ID = 1;

export default function App() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getBoard(DEMO_BOARD_ID)
      .then(setBoard)
      .catch(() =>
        setError(
          "Couldn't reach the backend. Make sure the Spring Boot app is running on http://localhost:8080."
        )
      );
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow AI</h1>
        <p className="subtitle">A Kanban board with an AI assistant for filling in task details.</p>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {!error && !board && <p className="loading">Loading board...</p>}
      {board && <Board board={board} setBoard={setBoard} />}
    </div>
  );
}
