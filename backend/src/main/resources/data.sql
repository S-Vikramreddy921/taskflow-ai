INSERT INTO boards (id, name) VALUES (1, 'TaskFlow AI Demo Board');

INSERT INTO board_columns (id, name, position, board_id) VALUES (1, 'To Do', 0, 1);
INSERT INTO board_columns (id, name, position, board_id) VALUES (2, 'In Progress', 1, 1);
INSERT INTO board_columns (id, name, position, board_id) VALUES (3, 'Done', 2, 1);

INSERT INTO tasks (id, title, description, priority, position, created_at, due_date, column_id) VALUES
    (1, 'Set up CI pipeline', 'Configure GitHub Actions to run tests on every push.', 'HIGH', 0, NOW(), DATEADD('DAY', 5, CURRENT_DATE), 1);
INSERT INTO tasks (id, title, description, priority, position, created_at, due_date, column_id) VALUES
    (2, 'Design task card component', 'Sketch the React component for an individual task card.', 'MEDIUM', 1, NOW(), NULL, 1);
INSERT INTO tasks (id, title, description, priority, position, created_at, due_date, column_id) VALUES
    (3, 'Wire up drag-and-drop', 'Integrate a drag-and-drop library for moving tasks between columns.', 'HIGH', 0, NOW(), DATEADD('DAY', -2, CURRENT_DATE), 2);
INSERT INTO tasks (id, title, description, priority, position, created_at, due_date, column_id) VALUES
    (4, 'Scaffold Spring Boot project', 'Initial project setup with REST controllers and H2.', 'MEDIUM', 0, NOW(), NULL, 3);

-- The inserts above use explicit IDs, which does NOT advance H2's auto-increment
-- counters. Without resetting them, the next task/column/board created through the
-- app would collide with an existing ID and fail. Reset each counter to one past
-- the highest ID used above.
ALTER TABLE tasks ALTER COLUMN id RESTART WITH 5;
ALTER TABLE board_columns ALTER COLUMN id RESTART WITH 4;
ALTER TABLE boards ALTER COLUMN id RESTART WITH 2;