package com.taskflow.controller;

import com.taskflow.dto.MoveTaskRequest;
import com.taskflow.dto.TaskRequest;
import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/columns/{columnId}/tasks")
    public List<Task> getTasksForColumn(@PathVariable Long columnId) {
        return taskService.getTasksForColumn(columnId);
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @PatchMapping("/tasks/{id}/move")
    public ResponseEntity<Task> moveTask(@PathVariable Long id, @Valid @RequestBody MoveTaskRequest request) {
        return ResponseEntity.ok(taskService.moveTask(id, request));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /** Deletes every task in a column in one shot, e.g. "Clear Done tasks". */
    @DeleteMapping("/columns/{columnId}/tasks")
    public ResponseEntity<Void> clearColumn(@PathVariable Long columnId) {
        taskService.clearColumn(columnId);
        return ResponseEntity.noContent().build();
    }
}
