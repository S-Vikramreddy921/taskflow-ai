INSERT INTO boards (id, name) VALUES (1, 'TaskFlow AI Demo Board');

INSERT INTO board_columns (id, name, position, board_id) VALUES (1, 'To Do', 0, 1);
INSERT INTO board_columns (id, name, position, board_id) VALUES (2, 'In Progress', 1, 1);
INSERT INTO board_columns (id, name, position, board_id) VALUES (3, 'Done', 2, 1);

INSERT INTO tasks (id, title, description, priority, position, created_at, column_id) VALUES
    (1, 'Set up CI pipeline', 'Configure GitHub Actions to run tests on every push.', 'HIGH', 0, NOW(), 1);
INSERT INTO tasks (id, title, description, priority, position, created_at, column_id) VALUES
    (2, 'Design task card component', 'Sketch the React component for an individual task card.', 'MEDIUM', 1, NOW(), 1);
INSERT INTO tasks (id, title, description, priority, position, created_at, column_id) VALUES
    (3, 'Wire up drag-and-drop', 'Integrate a drag-and-drop library for moving tasks between columns.', 'HIGH', 0, NOW(), 2);
INSERT INTO tasks (id, title, description, priority, position, created_at, column_id) VALUES
    (4, 'Scaffold Spring Boot project', 'Initial project setup with REST controllers and H2.', 'MEDIUM', 0, NOW(), 3);
